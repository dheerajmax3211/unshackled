package com.unshackled.api.repository;

import com.unshackled.api.model.ChallengeMediaModel;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class ChallengeMediaRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<ChallengeMediaModel> rowMapper = (rs, rowNum) -> new ChallengeMediaModel(
            rs.getObject("id", UUID.class),
            rs.getObject("challenge_id", UUID.class),
            rs.getString("storage_path"),
            rs.getString("public_url"),
            rs.getObject("exif_timestamp", OffsetDateTime.class),
            rs.getObject("exif_gps_lat", BigDecimal.class),
            rs.getObject("exif_gps_lng", BigDecimal.class),
            rs.getString("exif_raw"),
            rs.getObject("is_verified") != null ? rs.getBoolean("is_verified") : null,
            rs.getString("verification_reason"),
            rs.getObject("created_at", OffsetDateTime.class)
    );

    public void insert(ChallengeMediaModel model) {
        String sql = """
            INSERT INTO challenge_media (
                challenge_id, storage_path, public_url, exif_timestamp, 
                exif_gps_lat, exif_gps_lng, exif_raw, is_verified, verification_reason
            ) VALUES (?, ?, ?, ?, ?, ?, ?::jsonb, ?, ?)
        """;
        jdbcTemplate.update(sql,
                model.challengeId(),
                model.storagePath(),
                model.publicUrl(),
                model.exifTimestamp(),
                model.exifGpsLat(),
                model.exifGpsLng(),
                model.exifRaw(),
                model.isVerified(),
                model.verificationReason()
        );
    }

    public Optional<ChallengeMediaModel> findByChallengeId(UUID challengeId) {
        String sql = "SELECT * FROM challenge_media WHERE challenge_id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, rowMapper, challengeId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }
}
