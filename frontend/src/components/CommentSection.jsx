import { useState, useEffect } from "react";
import { getCommentList, writeComment, deleteComment } from "../shared/api/boardApi";

function CommentSection({ boardNo, member }) {
    // 불러오는 댓글 리스트
    const [comments, setComments] = useState([]);
    // 댓글 작성
    const [commentContent, setCommentContent] = useState("");
    // 댓글 수정, 삭제 드랍다운
    const [openMenu, setOpenMenu] = useState(null);
    const [editingNo, setEditingNo] = useState(null); // 지금 수정 중인 댓글 번호
    const [editContent, setEditContent] = useState(""); // 수정 중인 내용

    useEffect(() => {
        loadComments();
    }, [boardNo]);

    useEffect(() => {
        if (openMenu === null) return;

        const handleClickOutside = (e) => {
            if (!e.target.closest(".comment-menu-wrapper")) {
                setOpenMenu(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openMenu])

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

    // 댓글수정
    const handleEditClick = (comment) => {
        setEditingNo(comment.no);
        setEditContent(comment.content);
        setOpenMenu(null);
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
                                    {editingNo === comment.no ? (
                                        <div className="comment-edit-wrapper">
                                            <textarea
                                                className="comment-edit-textarea"
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                            />
                                            <div className="comment-edit-btn">
                                                <button type="button">
                                                    저장
                                                </button>
                                                <button type="button" onClick={() => setEditingNo(null)}>
                                                    취소
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="comment-content">
                                            {comment.content}
                                        </p>
                                    )}

                                    {member && member.id === comment.writerId && (
                                        <div className="comment-menu-wrapper">
                                            <button
                                                className="comment-menu-button"
                                                onClick={() => setOpenMenu(
                                                    openMenu === comment.no ? null : comment.no
                                                )}
                                            >
                                                ⋮
                                            </button>
                                            {openMenu === comment.no && (
                                                <div className="comment-dropdown">
                                                    <button type="button" onClick={() => handleEditClick(comment)}>수정</button>
                                                    <button type="button" className="delete-menu-item" onClick={() => handleDeleteComment(comment.no)}>삭제</button>
                                                </div>
                                            )}
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