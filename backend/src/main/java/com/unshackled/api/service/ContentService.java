package com.unshackled.api.service;

import com.unshackled.api.model.DopamineSuggestionModel;
import com.unshackled.api.model.HealthMilestoneModel;
import com.unshackled.api.model.MoneySuggestionModel;
import com.unshackled.api.model.WithdrawalModel;
import com.unshackled.api.repository.DopamineSuggestionRepository;
import com.unshackled.api.repository.HealthMilestoneRepository;
import com.unshackled.api.repository.MoneySuggestionRepository;
import com.unshackled.api.repository.WithdrawalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Orchestrates day-specific emotional and informational content.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ContentService {

    private final WithdrawalRepository withdrawalRepository;
    private final DopamineSuggestionRepository dopamineSuggestionRepository;
    private final MoneySuggestionRepository moneySuggestionRepository;
    private final HealthMilestoneRepository healthMilestoneRepository;

    /**
     * Fetches a supportive message based on the habit and how many days clean the user is.
     */
    public Optional<WithdrawalModel> getWithdrawalMessage(UUID habitId, int dayOffset) {
        return withdrawalRepository.findByHabitAndDay(habitId, dayOffset);
    }

    /**
     * Fetches 3 random activities to help replace dopamine.
     */
    public List<DopamineSuggestionModel> getDopamineSuggestions(List<String> habitSlugs) {
        return dopamineSuggestionRepository.findRandomByHabitSlugs(habitSlugs, 3);
    }

    /**
     * Fetches a contextual suggestion for what the user could buy with their savings.
     */
    public Optional<MoneySuggestionModel> getMoneySuggestion(String country, BigDecimal savedAmount) {
        return moneySuggestionRepository.findByCountryAndAmount(country, savedAmount);
    }

    /**
     * Fetches all health recovery milestones achieved up to the current day.
     */
    public List<HealthMilestoneModel> getHealthMilestones(UUID habitId, int dayOffset) {
        return healthMilestoneRepository.findByHabitAndDayRange(habitId, dayOffset);
    }
}
