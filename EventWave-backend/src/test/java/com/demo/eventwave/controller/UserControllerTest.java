package com.demo.eventwave.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(roles = "USER")
    public void userDashboard_ShouldReturnWelcomeMessage_ForAuthenticatedUser() throws Exception {
        mockMvc.perform(get("/api/user/dashboard"))
                .andExpect(status().isOk())
                .andExpect(content().string("Hello, USER! This is your dashboard."));
    }

    @Test
    public void userDashboard_ShouldBeUnauthorized_ForUnauthenticatedUser() throws Exception {
        mockMvc.perform(get("/api/user/dashboard"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "ORGANIZER")
    public void userDashboard_ShouldBeForbidden_ForOrganizerRole() throws Exception {
        mockMvc.perform(get("/api/user/dashboard"))
                .andExpect(status().isForbidden());
    }
}