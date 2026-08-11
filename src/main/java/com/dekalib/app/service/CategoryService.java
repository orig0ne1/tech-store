package com.dekalib.app.service;

import com.dekalib.app.dto.response.CategoryResponse;
import com.dekalib.app.dto.response.PageResponse;
import com.dekalib.app.dto.response.ProductSummaryResponse;
import com.dekalib.app.entity.Category;
import com.dekalib.app.exception.NotFoundException;
import com.dekalib.app.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final ProductService productService;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository, ProductService productService) {
        this.categoryRepository = categoryRepository;
        this.productService = productService;
    }

    public List<CategoryResponse> getAll() {
        return categoryRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public CategoryResponse getBySlug(String slug) {
        return toResponse(getCategoryBySlug(slug));
    }

    public PageResponse<ProductSummaryResponse> getProducts(
            String slug,
            int page,
            int size,
            String sort
    ) {
        getCategoryBySlug(slug);
        return productService.getProducts(page, size, null, slug, sort);
    }

    private Category getCategoryBySlug(String slug) {
        return categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new NotFoundException("CATEGORY_NOT_FOUND", "Category not found"));
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getImage()
        );
    }
}
