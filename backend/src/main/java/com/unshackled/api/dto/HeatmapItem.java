package com.unshackled.api.dto;

import java.time.LocalDate;

public record HeatmapItem(
    LocalDate date,
    String status
) {}
