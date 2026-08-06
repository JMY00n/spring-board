import { useState, useEffect } from "react";
import { getCommentList, writeComment } from "../shared/api/boardApi";

function CommentSection({ boardNo, member }) {
    // 불러오는 댓글 리스트
    const [comments, setComments] = useState([]);
    // 댓글 작성
    const [commentContent, setCommentContent] = useState("");

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
    )
}

export default CommentSection;