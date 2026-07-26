package com.carbontrack.app.oauth;

import com.carbontrack.app.repository.UserRepository;
import com.carbontrack.app.security.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import com.carbontrack.app.entity.User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import java.util.Optional;
import java.util.UUID;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler
        extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public OAuth2LoginSuccessHandler(
            UserRepository userRepository,
            JwtUtil jwtUtil) {

        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String firstName = oauthUser.getAttribute("given_name");
        String lastName = oauthUser.getAttribute("family_name");

        Optional<User> optionalUser = userRepository.findByEmail(email);

        User user;

        if (optionalUser.isPresent()) {

            user = optionalUser.get();

        } else {

            String username = email.split("@")[0];

            // Make username unique
            while (userRepository.existsByUsername(username)) {
                username = username + (int) (Math.random() * 1000);
            }

            user = User.builder()
                    .email(email)
                    .username(username)
                    .firstName(firstName)
                    .lastName(lastName)
                    .password(new BCryptPasswordEncoder()
                            .encode(UUID.randomUUID().toString()))
                    .provider("GOOGLE")
                    .role("USER")
                    .build();

            userRepository.save(user);
            String jwt = jwtUtil.generateToken(user.getUsername());

            //response.sendRedirect(
            //    "http://localhost:5173/oauth-success?token=" + jwt
            //);

            response.setContentType("text/plain");
            response.getWriter().write(jwt);
        }

    }
}