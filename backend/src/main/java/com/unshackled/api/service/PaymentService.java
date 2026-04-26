package com.unshackled.api.service;

import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.param.CustomerCreateParams;
import com.unshackled.api.config.StripeConfig;
import com.unshackled.api.exception.ResourceNotFoundException;
import com.unshackled.api.exception.ValidationException;
import com.unshackled.api.model.UserModel;
import com.unshackled.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Service for handling Stripe Checkout and Billing Portal sessions.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final StripeConfig stripeConfig;
    private final UserRepository userRepository;

    /**
     * Creates a Stripe Checkout Session for a subscription.
     */
    public String createCheckoutSession(String userId, String successUrl, String cancelUrl) throws StripeException {
        UUID uId = UUID.fromString(userId);
        UserModel user = userRepository.findById(uId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", uId));

        String customerId = user.stripeCustomerId();

        // Create Stripe customer if they don't have one yet
        if (customerId == null || customerId.isEmpty()) {
            CustomerCreateParams customerParams = CustomerCreateParams.builder()
                    .setName(user.displayName())
                    .setMetadata(java.util.Map.of("userId", userId))
                    .build();
            Customer customer = Customer.create(customerParams);
            customerId = customer.getId();
            userRepository.updateStripeCustomerId(uId, customerId);
        }

        com.stripe.param.checkout.SessionCreateParams params = 
            com.stripe.param.checkout.SessionCreateParams.builder()
                .setCustomer(customerId)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .setMode(com.stripe.param.checkout.SessionCreateParams.Mode.SUBSCRIPTION)
                .addLineItem(com.stripe.param.checkout.SessionCreateParams.LineItem.builder()
                        .setPrice(stripeConfig.getPremiumPriceId())
                        .setQuantity(1L)
                        .build())
                .putMetadata("userId", userId)
                .build();

        com.stripe.model.checkout.Session session = com.stripe.model.checkout.Session.create(params);
        return session.getUrl();
    }

    /**
     * Creates a Stripe Billing Portal session for subscription management.
     */
    public String createPortalSession(String userId, String returnUrl) throws StripeException {
        UserModel user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        String customerId = user.stripeCustomerId();
        if (customerId == null || customerId.isEmpty()) {
            throw new ValidationException("No Stripe customer account found. Please complete a checkout first.");
        }

        com.stripe.param.billingportal.SessionCreateParams portalSessionParams = 
            com.stripe.param.billingportal.SessionCreateParams.builder()
                .setCustomer(customerId)
                .setReturnUrl(returnUrl)
                .build();

        com.stripe.model.billingportal.Session portalSession = 
            com.stripe.model.billingportal.Session.create(portalSessionParams);
        
        return portalSession.getUrl();
    }
}
