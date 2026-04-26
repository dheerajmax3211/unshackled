package com.unshackled.api.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * STRIPE SETUP INSTRUCTIONS:
 * 1. Log in to the Stripe Dashboard (https://dashboard.stripe.com).
 * 2. Go to "Product Catalog" -> "Add product".
 * 3. Name: "Sovereign Plan"
 * 4. Description: "Full access to Unshackled premium features, including unlimited habits, social sharing, and detailed analytics."
 * 5. Pricing:
 *    - Type: Recurring
 *    - Billing period: Monthly
 *    - Amount: Set your desired price (e.g., ₹499 or $9.99)
 * 6. Save product.
 * 7. Copy the "API ID" (starts with price_...) and add it to your .env file as:
 *    STRIPE_PREMIUM_PRICE_ID=price_xxxxxxxxxxxxxxxx
 * 8. Set your Stripe Secret Key and Webhook Secret in .env as well.
 */
@Slf4j
@Configuration
@ConfigurationProperties(prefix = "stripe")
@Data
public class StripeConfig {

    private String apiKey;
    private String webhookSecret;
    private String priceId;

    @PostConstruct
    public void init() {
        if (apiKey != null && !apiKey.isBlank()) {
            Stripe.apiKey = apiKey;
            log.info("Stripe API key initialized successfully");
        } else {
            log.warn("Stripe API key is not configured. Payment features will be disabled.");
        }
    }

    /**
     * Returns the price ID for the Sovereign premium plan.
     */
    public String getPremiumPriceId() {
        return priceId;
    }
}
