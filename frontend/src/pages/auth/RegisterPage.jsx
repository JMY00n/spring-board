import { useState } from "react";
import { checkId, register } from "../../shared/api/authApi";
import { useNavigate } from "react-router-dom";
import React from "react";
import "./AuthPage.css";

function RegisterPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        id: '',
        password: '',
        passwordConfirm: '',
        email: '',
    });
    const [idCheck, setIdCheck] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value,
        });

        if (name === "id") {
            setIdCheck(null);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name) {
            alert("이름을 입력해주세요.");
            return;
        }

        if (!form.id) {
            alert("아이디를 입력해주세요.");
            return;
        }

        if (idCheck !== true) {
            alert("아이디 중복확인을 해주세요.");
            return;
        }

        if (!form.password) {
            alert("비밀번호를 입력해주세요.");
            return;
        }

        if (form.password != form.passwordConfirm) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        if (!form.id) {
            alert("아이디를 입력해주세요.");
            return;
        }

        const response = await register({
            name: form.name,
            id: form.id,
            password: form.password,
            email: form.email,
        });

        alert("회원가입 완료!");
        navigate("/login");
    }

    const handleIdCheck = async () => {
        if (!form.id) {
            alert("아이디를 입력해주세요.");
            return;
        }

        const response = await checkId(form.id);

        setIdCheck(!response.data);
    }

    return (
        <main className="auth-page">
            <section className="auth-box">
                <h1 className="auth-title">회원가입</h1>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="auth-input"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="이름"
                    />
                    <div className="id-box">
                        <input
                            className={`auth-input ${idCheck === true
                                    ? "success"
                                    : idCheck === false
                                        ? "error"
                                        : ""
                                }`}
                            name="id"
                            value={form.id}
                            onChange={handleChange}
                            placeholder="아이디"
                        />
                        <button
                            type='button'
                            onClick={handleIdCheck}
                            className="id-check-btn"
                        >
                            확인
                        </button>
                    </div>
                    {idCheck === true && (
                        <p className="id-message">사용 가능한 ID입니다.</p>
                    )}

                    {idCheck === false && (
                        <p className="id-message">이미 있는 ID입니다.</p>
                    )}

                    <input
                        type="password"
                        className="auth-input"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="비밀번호"
                    />
                    <input
                        type="password"
                        className="auth-input"
                        name="passwordConfirm"
                        value={form.passwordConfirm}
                        onChange={handleChange}
                        placeholder="비밀번호 확인"
                    />
                    <input
                        type="text"
                        className="auth-input"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="이메일 (선택)"
                    />
                    <button type="submit" className="auth-button">
                        회원가입
                    </button>
                    <button type="button" className="auth-button" onClick={() => navigate("/login")}>
                        뒤로가기
                    </button>
                </form>
            </section>
        </main>
    );
}

export default RegisterPage
