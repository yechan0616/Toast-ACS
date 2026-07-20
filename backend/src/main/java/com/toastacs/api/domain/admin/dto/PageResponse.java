package com.toastacs.api.domain.admin.dto;

import java.util.List;
import org.springframework.data.domain.Page;

public record PageResponse<T>(List<T> content, int page, int totalPages) {

    public static <S, T> PageResponse<T> of(Page<S> page, List<T> content) {
        return new PageResponse<>(content, page.getNumber(), page.getTotalPages());
    }
}
