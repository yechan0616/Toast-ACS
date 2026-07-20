package com.toastacs.api.global.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.toastacs.api.global.error.ErrorCode;
import com.toastacs.api.global.error.ErrorResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class GateKeyFilter extends OncePerRequestFilter {

    private final String gateKey;
    private final ObjectMapper objectMapper;

    public GateKeyFilter(@Value("${acs.gate-key}") String gateKey, ObjectMapper objectMapper) {
        this.gateKey = gateKey;
        this.objectMapper = objectMapper;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getRequestURI().startsWith("/api/gate/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String provided = request.getHeader("X-Gate-Key");
        if (provided == null || !MessageDigest.isEqual(
                provided.getBytes(StandardCharsets.UTF_8), gateKey.getBytes(StandardCharsets.UTF_8))) {
            response.setStatus(ErrorCode.GATE_KEY_INVALID.getStatus().value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding("UTF-8");
            objectMapper.writeValue(response.getWriter(), ErrorResponse.of(ErrorCode.GATE_KEY_INVALID));
            return;
        }
        filterChain.doFilter(request, response);
    }
}
