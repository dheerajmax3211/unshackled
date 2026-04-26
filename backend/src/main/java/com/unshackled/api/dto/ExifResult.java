package com.unshackled.api.dto;

import java.time.Instant;
import java.util.Map;

/**
 * Result DTO containing parsed EXIF metadata from an image.
 */
public record ExifResult(
        Instant timestamp,
        Double gpsLat,
        Double gpsLng,
        boolean hasMissingTimestamp,
        Map<String, String> rawTags
) {}
