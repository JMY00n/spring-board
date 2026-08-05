package com.jmin.myapp.service;

import com.jmin.myapp.dto.LoginRequest;
import com.jmin.myapp.dto.RegisterRequest;
import com.jmin.myapp.entity.Member;
import com.jmin.myapp.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final MemberRepository memberRepository;

    public void register(RegisterRequest request) {
        Member member = new Member();
        member.setName(request.getName());
        member.setId(request.getId());
        member.setPassword(request.getPassword());
        member.setEmail(request.getEmail());

        memberRepository.save(member);
    }

    public Optional<Member> login(LoginRequest request) {
        Optional<Member> member = memberRepository.findById(request.getId());

        if (member.isEmpty()) {
            return null;
        }

        if (!member.get().getPassword().equals(request.getPassword())) {
            return null;
        }

        return member;
    }

    public boolean checkId(String id) {
        return memberRepository.findById(id).isPresent();
    }
}
