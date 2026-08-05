import { Link } from "react-router-dom";

function BoardItem({ board }) {
    return (
        <tr>
            <td>{board.no}</td>
            <td>
                <Link to={`/board/${board.no}`} className="board-link">
                    {board.title}
                </Link>
            </td>
            <td>{board.writer}</td>
            <td>
                {new Date(board.createdAt).toLocaleDateString()}
            </td>
            <td>{board.viewCount}</td>
        </tr>
    );
}

export default BoardItem;