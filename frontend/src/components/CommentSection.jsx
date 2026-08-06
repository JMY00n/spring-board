import { useState, useEffect } from "react";
import { getCommentList, writeComment, deleteComment } from "../shared/api/boardApi";

function CommentSection({ boardNo, member }) {
    // 불러오는 댓글 리스트
    const [comments, setComments] = useState([]);
    // 댓글 작성
    const [commentContent, setCommentContent] = useState("");
    const [openMenu, setOpenMenu] = useState(null);

    useEffect(() => {
        loadComments();
    }, [boardNo]);

    // 댓글 불러오기
    const loadComments = async () => {
        const response = await getCommentList(boardNo);

        setComments(response.data);
    };

    // 댓글 등록
    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!commentContent.trim()) {
            alert("댓글 내용을 입력해주세요.");
            return;
        }

        try {
            await writeComment(boardNo, {
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

    // 댓글삭제
    const handleDeleteComment = async (commentNo) => {

        try {
            await deleteComment(commentNo);
            await loadComments();
        } catch (e) {
            if (e.response?.status === 401) {
                alert("작성자만 삭제가 가능합니다.");
                return;
            }
        }
    }

    return (
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
                                    <div className="comment-left">
                                        <strong>{comment.writer}</strong>
                                    </div>
                                    <div className="comment-right">
                                        <span>
                                            {new Date(comment.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="comment-body">
                                    
                                    <p className="comment-content">
                                        {comment.content}
                                    </p>

                                    {member && member.id === comment.writerId && (
                                        <button
                                            className="comment-menu-button"
                                            onClick={() => setOpenMenu(
                                                openMenu === comment.no ? null : comment.no
                                            )}
                                        >
                                            ⋮
                                        </button>
                                    )}
                                    {openMenu === comment.no && (
                                        <div className="comment-dropdown">
                                            <button type="button">
                                                수정
                                            </button>
                                            <button
                                                type="button"
                                                className="delete-menu-item"
                                                onClick={() => handleDeleteComment(comment.no)}
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </section>
    )
}

export default CommentSection;