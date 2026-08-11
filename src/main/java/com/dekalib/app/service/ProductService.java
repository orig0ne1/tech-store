package com.dekalib.app.service;

import com.dekalib.app.dto.response.AvailabilityResponse;
import com.dekalib.app.dto.response.CategoryRefResponse;
import com.dekalib.app.dto.response.PageResponse;
import com.dekalib.app.dto.response.ProductResponse;
import com.dekalib.app.dto.response.ProductSummaryResponse;
import com.dekalib.app.entity.Product;
import com.dekalib.app.exception.BadRequestException;
import com.dekalib.app.exception.NotFoundException;
import com.dekalib.app.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

@Service
@Transactional(readOnly = true)
public class ProductService {
    private static final Set<String> SORT_FIELDS = Set.of("id", "name", "price", "createdAt");

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public PageResponse<ProductSummaryResponse> getProducts(
            int page,
            int size,
            String search,
            String categorySlug,
            String sort
    ) {
        Sort sortBy = parseSort(sort);
        PageRequest pageable = PageRequest.of(page, size, sortBy);

        Specification<Product> spec = buildSpecification(search, categorySlug);
        Page<Product> result = productRepository.findAll(spec, pageable);

        return new PageResponse<>(
                result.getContent().stream().map(this::toSummaryResponse).toList(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages()
        );
    }

    public ProductResponse getBySlug(String slug) {
        return toProductResponse(getProductBySlug(slug));
    }

    public List<ProductSummaryResponse> getRelated(String slug) {
        Product product = getProductBySlug(slug);
        if (product.getCategory() == null) {
            return List.of();
        }
        return productRepository
                .findTop4ByCategorySlugAndSlugNotOrderByIdAsc(product.getCategory().getSlug(), slug)
                .stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    public AvailabilityResponse getAvailability(String slug) {
        return new AvailabilityResponse(getProductBySlug(slug).isAvailable());
    }

    private Specification<Product> buildSpecification(String search, String categorySlug) {
        Specification<Product> spec = Specification.where(null);
        if (search != null && !search.isBlank()) {
            String term = search.trim().toLowerCase();
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("name")), "%" + term + "%"));
        }
        if (categorySlug != null && !categorySlug.isBlank()) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("category").get("slug"), categorySlug));
        }
        return spec;
    }

    private Sort parseSort(String sort) {
        String[] parts = (sort == null || sort.isBlank() ? "id,asc" : sort).split(",");
        String field = parts[0].trim();
        String direction = parts.length > 1 ? parts[1].trim() : "asc";
        if (!SORT_FIELDS.contains(field)) {
            throw new BadRequestException("INVALID_SORT", "Unsupported sort field: " + field);
        }
        Sort.Direction dir = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
        return Sort.by(dir, field);
    }

    private Product getProductBySlug(String slug) {
        return productRepository.findBySlug(slug)
                .orElseThrow(() -> new NotFoundException("PRODUCT_NOT_FOUND", "Product not found"));
    }

    private ProductResponse toProductResponse(Product product) {
        CategoryRefResponse category = product.getCategory() == null
                ? null
                : new CategoryRefResponse(
                        product.getCategory().getId(),
                        product.getCategory().getName(),
                        product.getCategory().getSlug()
                );
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getSlug(),
                product.getDescription(),
                product.getPrice(),
                product.getCurrency(),
                product.getImage(),
                new ArrayList<>(product.getImages()),
                new HashMap<>(product.getAttributes()),
                category,
                product.isAvailable()
        );
    }

    private ProductSummaryResponse toSummaryResponse(Product product) {
        return new ProductSummaryResponse(
                product.getId(),
                product.getName(),
                product.getSlug(),
                product.getDescription(),
                product.getPrice(),
                product.getCurrency(),
                product.getImage(),
                product.isAvailable()
        );
    }
}
