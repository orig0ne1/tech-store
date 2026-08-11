package com.dekalib.app.controller;

import com.dekalib.app.config.AppProperties;
import com.dekalib.app.dto.response.CategoryResponse;
import com.dekalib.app.dto.response.PageResponse;
import com.dekalib.app.dto.response.ProductSummaryResponse;
import com.dekalib.app.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {
    private final CategoryService categoryService;
    private final AppProperties appProperties;

    @Autowired
    public CategoryController(CategoryService categoryService, AppProperties appProperties) {
        this.categoryService = categoryService;
        this.appProperties = appProperties;
    }

    @GetMapping
    public List<CategoryResponse> getAll() {
        return categoryService.getAll();
    }

    @GetMapping("/{slug}")
    public CategoryResponse getBySlug(@PathVariable String slug) {
        return categoryService.getBySlug(slug);
    }

    @GetMapping("/{slug}/products")
    public PageResponse<ProductSummaryResponse> getProducts(
            @PathVariable String slug,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "id,asc") String sort
    ) {
        int resolvedSize = size == null || size < 1 ? appProperties.getPagination().getDefaultSize() : size;
        return categoryService.getProducts(slug, page, resolvedSize, sort);
    }
}
