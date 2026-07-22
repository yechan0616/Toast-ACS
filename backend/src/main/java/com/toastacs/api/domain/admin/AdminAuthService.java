package com.toastacs.api.domain.admin;

import com.toastacs.api.domain.admin.dto.AdminProfileResponse;
import com.toastacs.api.domain.admin.dto.AdminProfileUpdateRequest;
import com.toastacs.api.global.error.ApiException;
import com.toastacs.api.global.error.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminAuthService {

    private final AdminAccountRepository adminAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecurityContextRepository securityContextRepository;

    @Transactional(readOnly = true)
    public void login(String username, String password, HttpServletRequest request, HttpServletResponse response) {
        AdminAccount account = adminAccountRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException(ErrorCode.INVALID_CREDENTIALS));
        if (!passwordEncoder.matches(password, account.getPasswordHash())) {
            throw new ApiException(ErrorCode.INVALID_CREDENTIALS);
        }
        Authentication authentication = UsernamePasswordAuthenticationToken.authenticated(
                account.getUsername(), null, List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, request, response);
    }

    public void logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
    }

    @Transactional(readOnly = true)
    public AdminProfileResponse profile(String username) {
        AdminAccount account = adminAccountRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException(ErrorCode.UNAUTHORIZED));
        return new AdminProfileResponse(account.getUsername(), account.getName(), account.getAvatar());
    }

    @Transactional
    public AdminProfileResponse updateProfile(String username, AdminProfileUpdateRequest request) {
        AdminAccount account = adminAccountRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException(ErrorCode.UNAUTHORIZED));
        if (request.name() != null && !request.name().isBlank()) {
            account.rename(request.name().trim());
        }
        if (request.newPassword() != null && !request.newPassword().isBlank()) {
            if (request.currentPassword() == null
                    || !passwordEncoder.matches(request.currentPassword(), account.getPasswordHash())) {
                throw new ApiException(ErrorCode.INVALID_CREDENTIALS);
            }
            account.changePassword(passwordEncoder.encode(request.newPassword()));
        }
        if (request.avatar() != null) {
            account.changeAvatar(request.avatar().isBlank() ? null : request.avatar());
        }
        return new AdminProfileResponse(account.getUsername(), account.getName(), account.getAvatar());
    }
}
