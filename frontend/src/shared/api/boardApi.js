import { data } from "react-router-dom";
import { apiClient } from "./client";

export const getBoardList = (page) => {
    return apiClient.get("/board", {
        params: {
            page
        }
    });
} 

export const getBoardDetail = (no) => {
    return apiClient.get(`/board/${no}`);
};

export const writeBoard = (data) => {
    return apiClient.post('/board/write', data);
};

export const deleteBoard = (no) => {
    return apiClient.delete(`/board/${no}`);
};

export const updateBoard = (no, data) => {
    return apiClient.put(`/board/${no}`, data);
};

export const getCommentList = (boardNo) => {
    return apiClient.get(`/board/${boardNo}/comments`);
}

export const writeComment = (boardNo, data) => {
    return apiClient.post(`/board/${boardNo}/comments`, data);
};

export const deleteComment = (commentNo) => {
    return apiClient.delete(`/board/${commentNo}/comments`);
}