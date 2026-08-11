package com.dekalib.app.controller;

import com.dekalib.app.config.AppProperties;
import com.dekalib.app.dto.response.AvailabilityResponse;
import com.dekalib.app.dto.response.PageResponse;
import com.dekalib.app.dto.response.ProductResponse;
import com.dekalib.app.dto.response.ProductSummaryResponse;
import com.dekalib.app.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {
    private final ProductService productService;
    private final AppProperties appProperties;

    @Autowired
    public ProductController(ProductService productService, AppProperties appProperties) {
        this.productService = productService;
        this.appProperties = appProperties;
    }

    @GetMapping
    public PageResponse<ProductSummaryResponse> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "id,asc") String sort
    ) {
        return productService.getProducts(page, resolveSize(size), search, category, sort);
    }

    @GetMapping("/{slug}")
    public ProductResponse getBySlug(@PathVariable String slug) {
        return productService.getBySlug(slug);
    }

    @GetMapping("/{slug}/related")
    public List<ProductSummaryResponse> getRelated(@PathVariable String slug) {
        return productService.getRelated(slug);
    }

    @GetMapping("/{slug}/availability")
    public AvailabilityResponse getAvailability(@PathVariable String slug) {
        return productService.getAvailability(slug);
    }

    private int resolveSize(Integer size) {
        return size == null || size < 1 ? appProperties.getPagination().getDefaultSize() : size;
    }
}
