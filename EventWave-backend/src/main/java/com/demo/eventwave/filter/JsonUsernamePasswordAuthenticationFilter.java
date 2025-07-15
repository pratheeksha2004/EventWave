package com.demo.eventwave.filter;


import com.demo.eventwave.dto.LoginRequest;
import com.demo.eventwave.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class JsonUsernamePasswordAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final JwtUtil jwtUtil;

    public JsonUsernamePasswordAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
        this.setFilterProcessesUrl("/api/auth/login");

        this.setAuthenticationSuccessHandler((request, response, authentication) -> {
            // Generate JWT token
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String username = userDetails.getUsername();
            String role = userDetails.getAuthorities().stream()
                    .findFirst()
                    .map(auth -> auth.getAuthority().replace("ROLE_", ""))
                    .orElse("");

            String token = jwtUtil.generateToken(username, role);

            // Prepare response JSON
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("message", "Login successful");
            responseBody.put("token", token);

            // Write response
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(objectMapper.writeValueAsString(responseBody));
            response.getWriter().flush();
        });

        this.setAuthenticationFailureHandler((request, response, exception) -> {
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding("UTF-8");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Invalid username or password\"}");
            response.getWriter().flush();
        });
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        if (request.getContentType() == null || !request.getContentType().startsWith(MediaType.APPLICATION_JSON_VALUE)) {
            return super.attemptAuthentication(request, response);
        }

        try {
            LoginRequest loginRequest = objectMapper.readValue(request.getInputStream(), LoginRequest.class);

            String username = loginRequest.getUsername();
            String password = loginRequest.getPassword();

            UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(username, password);
            setDetails(request, authRequest);

            return this.getAuthenticationManager().authenticate(authRequest);
        } catch (IOException e) {
            throw new AuthenticationServiceException("Failed to parse authentication request body");
        }
    }
}
