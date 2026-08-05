import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./BoardWritePage.css";
import { getBoardDetail, writeBoard, updateBoard } from "../../shared/api/boardApi";
import { getMe } from "../../shared/api/authApi";

function BoardWritePage() {
    const navigate = useNavigate();
    const { no } = useParams();
    
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [member, setMember] = useState(null);

    const handleSubmit = async () => {
        if (no) {
            await updateBoard(no, {
                title,
                content
            });
            alert("수정완료");
        } else {
            await writeBoard({
                title,
                content
            });
            alert("작성완료");
        }
        navigate("/");

    };

    // 비회원이 주소를 직접 타고 들어가는 걸 방지
    useEffect(() => {
        const fetchMember = async () => {
            try {
                const response = await getMe();
                setMember(response.data);
            } catch (e) {
                alert("로그인이 필요합니다.");
                navigate("/login");
            }
        };

        fetchMember();
    }, []);

    // no을 받아와 게시글 수정인 경우
    useEffect(() => {
        if (!no) return;

        const fetchBoard = async () => {
            const response = await getBoardDetail(no);

            setTitle(response.data.title);
            setContent(response.data.content);
        }

        fetchBoard();
    }, [no]);

    return (
        <div className="write-wrapper">
            <h1>게시글 작성</h1>

            <div className="write-box">
                <div className="form-group">
                    <label>제목</label>

                    <input 
                        type="text"
                        placeholder="제목"
                        value={title}
                        onChange={(e) => {setTitle(e.target.value)}}
                    />
                </div>

                <div className="form-group">
                    <label>내용</label>
                    <textarea
                        placeholder="내용"
                        value={content}
                        onChange={(e) => {setContent(e.target.value)}}
                    />
                </div>

                <div className="button-area">
                    <button onClick={handleSubmit}>
                        {no ? "수정" : "작성"}
                    </button>
                    <button onClick={() => navigate("/")}>취소</button>
                </div>
            </div>
        </div>
    );
}

export default BoardWritePage;