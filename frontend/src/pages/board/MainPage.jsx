import { useEffect, useState } from "react";
import { getMe } from "../../shared/api/authApi";
import { useNavigate } from "react-router-dom";
import { logout } from "../../shared/api/authApi";
import "./MainPage.css";
import { getBoardList } from "../../shared/api/boardApi";
import BoardItem from "../../components/BoardItem";

function MainPage() {
    const navigate = useNavigate();
    
    const [boards, setBoards] = useState([]);
    const [member, setMember] = useState(null);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // 페이지 계산
    // 0~4 까지 1그룹, 5~9 2그룹
    const pageGroup = Math.floor(page / 5);
    const startPage = pageGroup * 5;
    const endPage = Math.min(startPage + 4, totalPages - 1);
    
    const pageNumbers = [];

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    useEffect(() => {
        loadBoards();
    }, [page]);

    const loadBoards = async () => {
        const response = await getBoardList(page);
        setBoards(response.data.content);
        setTotalPages(response.data.totalPages);
    }

    const handleLogout = async () => {
        // 로그아웃
        await logout();
        navigate("/login");
    }

    useEffect(() => {
        const fetchMember = async () => {
            try {
                const memberResponse = await getMe();
                setMember(memberResponse.data);
            } catch (e) {
                setMember(null);
            }
        };

        fetchMember();
    }, []);

    return (
        <div className="wrapper">
            <header className="header">
                <h1 onClick={() => navigate("/")}>메인 화면</h1>

                <div className="user-info">
                    {member ? (
                        <>
                            <span>{member.name}님 환영합니다.</span>
                            <button onClick={handleLogout}>로그아웃</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => navigate("/login")}>
                                로그인
                            </button>
                            <button onClick={() => navigate("/register")}>
                                회원가입
                            </button>
                        </>
                    )}
                </div>
            </header>

            <main className="content">
                <div className="board-header">
                    <h3>게시글</h3>
                    {member && (
                        <button onClick={() => {navigate("/board/write")}}>글작성</button>
                    )}
                </div>
                <table className="board-table">
                    <thead>
                        <tr>
                            <td>번호</td>
                            <td>제목</td>
                            <td>작성자</td>
                            <td>작성일</td>
                            <td>조회</td>
                        </tr>
                    </thead>
                    <tbody>
                        {boards.map(board => (
                            <BoardItem
                                key={board.no}
                                board={board}
                            />
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button
                        disabled={page===0}
                        onClick={() => setPage(page-1)}
                    >
                        이전
                    </button>
                    {startPage > 0 && (
                        <button
                            onClick={() => setPage(startPage - 1)}
                        >
                            ...
                        </button>
                    )}
                    {pageNumbers.map(number => (
                        <button
                            key={number}
                            className={page === number ? "active" : ""}
                            onClick={() => setPage(number)} 
                        >
                            {number + 1}
                        </button>
                    ))}
                    {endPage < totalPages - 1 && (
                        <button
                            onClick={() => setPage(endPage + 1)}
                        >
                            ...
                        </button>
                    )}
                    <button
                        disabled={page===totalPages-1}
                        onClick={() => setPage(page+1)}
                    >
                        다음
                    </button>
                </div>
            </main>
        </div>

    );
}

export default MainPage;