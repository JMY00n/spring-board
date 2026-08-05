import { useState } from 'react';
import { login } from '../../shared/api/authApi';
import { useNavigate } from "react-router-dom";
import './AuthPage.css'

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login(form);

      alert("로그인 성공");
      navigate("/");
    } catch (error) {
      alert("아이디 또는 비밀번호가 틀렸습니다.");
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-box">
        <h1 className="auth-title">로그인</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
            <input 
              className="auth-input"
              name="id"
              value={form.id}
              onChange={handleChange}
              placeholder="아이디"
            />
          <input 
            className="auth-input"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="비밀번호" 
          />
          <button
            className="auth-button" 
            type="submit">
              로그인
          </button>
          <button
            className="auth-button" 
            type="button"
            onClick={() => navigate("/register")}
            >
              회원가입
          </button>
          <button 
              className='auth-button'
              type='button'
              onClick={() => navigate("/")}
              >
            비회원
          </button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage