import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deleteBoard, getBoardDetail } from "../../shared/api/boardApi";
import { getMe } from "../../shared/api/authApi";
import CommentSection from "../../components/CommentSection";
import "./BoardDetailPage.css";

function BoardDetailPage() {
    const { no } = useParams();
    const navigate = useNavigate();

    const [board, setBoard] = useState(null);
    const [member, setMember] = useState(null);


    useEffect(() => {
        const fetchBoard = async () => {
            try {
                // 게시글 불러오기
                const boardResponse = await getBoardDetail(no);
                setBoard(boardResponse.data);
                // 회원 정보 불러오기
                const memberResponse = await getMe();
                setMember(memberResponse.data);
            } catch (e) {
                console.log(e.response);
            }
        };

        fetchBoard();
    }, [no]);

    // 게시글 삭제
    const handleDelete = async () => {
        if (!window.confirm("삭제하시겠습니까?")) {
            return;
        }

        await deleteBoard(board.no);

        alert("삭제되었습니다.");

        navigate("/");
    }

    if (!board) {
        return <div>게시글 불러오는 중...</div>
    }

    return (
        <div className="detail-wrapper">
            <h1>게시글 상세</h1>

            <div className="detail-box">
                <div className="detail-title">
                    {board.title}
                </div>

                <div className="detail-info">
                    <span>
                        작성자 : {board.writer}
                    </span>
                    <span>
                        조회수 : {board.viewCount}
                    </span>
                    <span>
                        작성일 : {new Date(board.createdAt).toLocaleDateString()}
                    </span>
                    {member && member.id === board.writerId && (
                        <button onClick={() => navigate(`/board/edit/${board.no}`)}
                            className="edit-button"
                        >
                            수정
                        </button>

                    )}
                </div>
                <hr />

                <div className="detail-content">
                    {board.content}
                </div>

                <div>
                    <button onClick={() => navigate("/")}
                        className="board-button"
                    >
                        목록
                    </button>
                    {member && member.id === board.writerId && (
                        <button onClick={handleDelete}
                            className="board-button delete-button"
                        >
                            삭제
                        </button>
                    )}
                </div>
            </div>
            <CommentSection 
                boardNo={no}
                member={member}
            />
        </div>
    );
}

export default BoardDetailPage;


