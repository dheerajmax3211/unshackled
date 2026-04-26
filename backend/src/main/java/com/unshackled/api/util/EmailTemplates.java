package com.unshackled.api.util;

/**
 * Static templates for system emails.
 */
public class EmailTemplates {

    public static String getMilestoneEmail(String name, String habitName, int days) {
        return """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h1 style="color: #4CAF50;">Amazing Milestone, %s!</h1>
                <p>You have been clean from <strong>%s</strong> for <strong>%d days</strong>.</p>
                <p>This is a monumental achievement. Your brain is literally rewiring itself, and you are reclaiming your sovereignty.</p>
                <p>Keep pushing forward.</p>
                <br/>
                <p>Stay Unshackled,</p>
                <p>The Unshackled Team</p>
            </div>
            """.formatted(name != null ? name : "Sovereign", habitName, days);
    }

    public static String getRelapseRecoveryEmail(String name, String habitName) {
        return """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h1 style="color: #FF5722;">A minor stumble, %s. Not a fall.</h1>
                <p>We noticed you slipped on your journey with <strong>%s</strong>.</p>
                <p>A relapse is not the end of your progress; it is simply data. You have already proven you can walk this path.</p>
                <p>Take a deep breath. Forgive yourself. And let's start day one again.</p>
                <br/>
                <p>We're here for you,</p>
                <p>The Unshackled Team</p>
            </div>
            """.formatted(name != null ? name : "Sovereign", habitName);
    }
    
    public static String getChallengeEmail(String challengerName, String habitName) {
        return """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h1 style="color: #2196F3;">Accountability Check!</h1>
                <p><strong>%s</strong> just requested proof for your <strong>%s</strong> habit.</p>
                <p>You have 10 minutes to upload a live photo to verify your streak.</p>
                <br/>
                <a href="https://unshackled.app/challenges" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Respond Now</a>
            </div>
            """.formatted(challengerName, habitName);
    }

    public static String getWeeklyReportEmail(com.unshackled.api.dto.WeeklyReportData data) {
        StringBuilder habitsHtml = new StringBuilder();
        for (var h : data.habitProgressions()) {
            habitsHtml.append("<li><strong>").append(h.habitName()).append("</strong>: ")
                    .append(h.daysCleanThisWeek()).append(" clean days this week. (Current Streak: ")
                    .append(h.currentStreak()).append(" days)</li>");
        }

        return """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h1 style="color: #673AB7;">Your Weekly Sovereignty Report</h1>
                <p>Hi %s,</p>
                <p>Here's a summary of your progress over the last 7 days:</p>
                <ul>
                    %s
                </ul>
                <p><strong>Total Money Saved this week:</strong> $%s</p>
                <p><strong>Total Clean Days across all habits:</strong> %d</p>
                <br/>
                <p>Stay focused, stay unshackled.</p>
                <p>The Unshackled Team</p>
            </div>
            """.formatted(data.username(), habitsHtml.toString(), data.totalMoneySavedThisWeek().toString(), data.totalCleanDaysThisWeek());
    }

    public static String getSupporterNudgeEmail(String supporterName, java.util.List<FriendRecoverySummary> summaries) {
        StringBuilder friendsHtml = new StringBuilder();
        for (var s : summaries) {
            String status = s.hadRelapse() ? "<span style='color: #F44336;'> (Had a slip)</span>" : "<span style='color: #4CAF50;'> (Clean)</span>";
            friendsHtml.append("<li><strong>").append(s.displayName()).append("</strong>: ")
                    .append(s.cleanDaysThisWeek()).append(" clean days this week.").append(status).append("</li>");
        }

        return """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h1 style="color: #FF9800;">Supporter Nudge: How your friends are doing</h1>
                <p>Hi %s,</p>
                <p>As a supporter, your encouragement matters. Here's a quick summary of your friends' progress this week:</p>
                <ul>
                    %s
                </ul>
                <p>Reach out to them today to offer a word of encouragement or congratulations!</p>
                <br/>
                <p>Leading the way,</p>
                <p>The Unshackled Team</p>
            </div>
            """.formatted(supporterName, friendsHtml.toString());
    }

    public record FriendRecoverySummary(String displayName, int cleanDaysThisWeek, boolean hadRelapse) {}
}
