import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BoardDetailPage.css";
import { deleteBoard, getBoardDetail } from "../../shared/api/boardApi";
import { getMe } from "../../shared/api/authApi";
import { getCommentList, writeComment } from "../../shared/api/boardApi";

function BoardDetailPage() {
    const { no } = useParams();
    const navigate = useNavigate();

    const [board, setBoard] = useState(null);
    const [member, setMember] = useState(null);
    // 불러오는 댓글 리스트
    const [comments, setComments] = useState([]);
    // 댓글 작성
    const [commentContent, setCommentContent] = useState("");

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

    useEffect(() => {
        loadComments();
    }, [no]);

    // 댓글 불러오기
    const loadComments = async () => {
        const response = await getCommentList(no);

        setComments(response.data);
    }

    // 게시글 삭제
    const handleDelete = async () => {
        if (!window.confirm("삭제하시겠습니까?")) {
            return;
        }

        await deleteBoard(board.no);

        alert("삭제되었습니다.");

        navigate("/");
    }

    // 댓글 등록
    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!commentContent.trim()) {
            alert("댓글 내용을 입력해주세요.");
            return;
        }

        try {
            await writeComment(no, {
                content: commentContent
            });

            setCommentContent("");
            await loadComments();
        } catch (e) {
            if (e.response?.status === 401) {
                alert("로그인이 필요합니다.");
                return;
            }

            console.log(e.response);
            alert("댓글 등록에 실패했습니다.");
        }
    };

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
                    <button onClick={() => navigate(`/board/edit/${board.no}`)}
                        className="edit-button"
                    >
                        수정
                    </button>
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
                <section className="comment-section">
                    <div className="comment-title-row">
                        <h3>댓글 {comments.length}개</h3>

                        <button type="submit" form="comment-form">
                            등록
                        </button>
                    </div>

                    <form
                        id="comment-form"
                        className="comment-form"
                        onSubmit={handleCommentSubmit}
                    >
                        <textarea
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            placeholder="댓글을 입력해주세요."
                        />

                    </form>

                    <div className="comment-list">
                        {comments.length === 0 ? (
                            <p className="comment-empty">
                                등록된 댓글이 없습니다.
                            </p>
                        ) : (
                            comments.map(comment => {
                                return (
                                    <div
                                        className="comment-item"
                                        key={comment.no}
                                    >
                                        <div className="comment-header">
                                            <strong>{comment.writer}</strong>
                                            <span>
                                                {new Date(comment.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <p>{comment.content}</p>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default BoardDetailPage;


