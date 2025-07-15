package com.demo.eventwave.config;

import com.demo.eventwave.filter.JwtAuthenticationFilter;
import com.demo.eventwave.filter.JsonUsernamePasswordAuthenticationFilter;
import com.demo.eventwave.service.UserDetailsServiceImpl;
import com.demo.eventwave.util.JwtUtil;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtUtil jwtUtil;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter,
                          UserDetailsServiceImpl userDetailsService,
                          JwtUtil jwtUtil) {
        this.jwtFilter = jwtFilter;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                // ✅ FIX #1: Correctly apply the CORS configuration source
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                        // User details endpoints
                        .requestMatchers(HttpMethod.GET,"/api/user/me").hasAnyRole("USER", "ORGANIZER")
                        .requestMatchers(HttpMethod.PUT,"/api/user/update").hasAnyRole("USER", "ORGANIZER")
                        
                        // Organizer-only endpoints
                        .requestMatchers(HttpMethod.GET, "/api/organizer/events/**").hasRole("ORGANIZER")
                        .requestMatchers(HttpMethod.POST, "/api/organizer/events").hasRole("ORGANIZER")
                        .requestMatchers(HttpMethod.PUT, "/api/organizer/events/**").hasRole("ORGANIZER")
                        .requestMatchers(HttpMethod.DELETE, "/api/organizer/events/**").hasRole("ORGANIZER")


                        // Attendee endpoints (The rule you need is here and looks correct)
                        .requestMatchers("/api/attendee/events/**").hasAnyRole("USER", "ORGANIZER")
                        
                        
                        .requestMatchers(HttpMethod.GET, "/api/registrations/**").hasAnyRole("USER", "ORGANIZER")
                        .requestMatchers(HttpMethod.POST,"/api/registrations/register/**").hasAnyRole("USER", "ORGANIZER")
                        .requestMatchers(HttpMethod.POST,"/api/registrations/unregister").hasAnyRole("USER", "ORGANIZER")
                        

                        .requestMatchers("/api/attendee/events/my-registrations").hasRole("USER")

                        // Organizer-only registration endpoints
                        .requestMatchers("/api/registrations/attendees/**").hasRole("ORGANIZER")
                        .requestMatchers("/api/attendee/wishlist/**").hasAnyRole("USER", "ORGANIZER")

                        // Default deny
                        .anyRequest().authenticated()
                )
                .sessionManagement(sess -> sess
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(daoAuthenticationProvider())
                // We'll keep their filter order for now, as login works.
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jsonAuthFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    
    // Example CORS Configuration
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "x-auth-token"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // ✅ FIX #2: Apply CORS to ALL paths, not just the root
        source.registerCorsConfiguration("/**", configuration); 
        return source;
    }

    // --- No changes needed below this line ---

    @Bean
    public JsonUsernamePasswordAuthenticationFilter jsonAuthFilter() throws Exception {
        JsonUsernamePasswordAuthenticationFilter filter = new JsonUsernamePasswordAuthenticationFilter(jwtUtil);
        filter.setAuthenticationManager(authenticationManager(null));
        filter.setFilterProcessesUrl("/api/auth/login");
        return filter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        provider.setHideUserNotFoundExceptions(false);
        return provider;
    }
}