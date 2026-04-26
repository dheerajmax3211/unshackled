package com.unshackled.api.service;

import com.drew.imaging.ImageMetadataReader;
import com.drew.lang.GeoLocation;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.drew.metadata.Tag;
import com.drew.metadata.exif.ExifSubIFDDirectory;
import com.drew.metadata.exif.GpsDirectory;
import com.unshackled.api.dto.ExifResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.time.Instant;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Service dedicated to parsing EXIF data to verify photographic proof.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ExifExtractionService {

    private final SupabaseStorageService storageService;

    public ExifResult extractExif(String imageUrl) {
        try {
            // 1. Download image bytes
            byte[] imageBytes = storageService.downloadFile(imageUrl);
            
            // 2. Extract Metadata
            Metadata metadata = ImageMetadataReader.readMetadata(new ByteArrayInputStream(imageBytes));
            
            Instant timestamp = null;
            boolean missingTimestamp = true;
            Double lat = null;
            Double lng = null;
            Map<String, String> rawTags = new HashMap<>();

            // 3. Parse all directories
            for (Directory directory : metadata.getDirectories()) {
                for (Tag tag : directory.getTags()) {
                    rawTags.put(tag.getTagName(), tag.getDescription());
                }

                // Look for Date/Time Original
                if (directory instanceof ExifSubIFDDirectory exifDir) {
                    Date date = exifDir.getDate(ExifSubIFDDirectory.TAG_DATETIME_ORIGINAL);
                    if (date != null) {
                        timestamp = date.toInstant();
                        missingTimestamp = false;
                    }
                }

                // Look for GPS
                if (directory instanceof GpsDirectory gpsDir) {
                    GeoLocation location = gpsDir.getGeoLocation();
                    if (location != null && !location.isZero()) {
                        lat = location.getLatitude();
                        lng = location.getLongitude();
                    }
                }
            }

            return new ExifResult(timestamp, lat, lng, missingTimestamp, rawTags);

        } catch (Exception e) {
            log.error("Failed to extract EXIF from image: {}", imageUrl, e);
            // If it fails, assume missing metadata rather than blowing up the app.
            return new ExifResult(null, null, null, true, Map.of("error", e.getMessage()));
        }
    }
}
