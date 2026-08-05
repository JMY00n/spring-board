package com.jmin.myapp.controller;

import com.jmin.myapp.dto.LoginRequest;
import com.jmin.myapp.dto.RegisterRequest;
import com.jmin.myapp.entity.Member;
import com.jmin.myapp.service.AuthService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        authService.register(request);

        return "회원가입 완료";
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpSession session) {
        Optional<Member> member = authService.login(request);

        if (member.isPresent()) {
            session.setAttribute("loginMember", member.get());
            return ResponseEntity.ok("로그인 성공");
        }

        return ResponseEntity.badRequest().body("아이디 또는 비밀번호가 틀렸습니다.");
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession session) {
        Member member = (Member)session.getAttribute("loginMember");

        if (member == null) {
            return ResponseEntity.badRequest().body("로그인을 해주세요.");
        }

        return ResponseEntity.ok(member);
    }

    @GetMapping("/id-check")
    public ResponseEntity<?> checkId(@RequestParam String id) {
        boolean exists = authService.checkId(id);

        return ResponseEntity.ok(exists);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();

        return ResponseEntity.ok("로그아웃 성공");
    }

}
