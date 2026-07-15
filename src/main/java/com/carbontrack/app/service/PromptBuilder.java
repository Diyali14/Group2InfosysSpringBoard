package com.carbontrack.app.service;

import com.carbontrack.app.dto.response.ActivityEmissionSummary;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PromptBuilder {

    public String buildRecommendationPrompt(
            List<ActivityEmissionSummary> activities,
            double totalEmission
    ) {

        StringBuilder prompt = new StringBuilder();

        prompt.append(String.format("""
You are an expert sustainability advisor.

The following are the user's TOP %d highest-emission activities from the LAST 30 DAYS.

Overall Carbon Footprint:
%.2f kg CO₂

Your task:

1. Analyze ONLY the activities provided below.
2. Explain why each activity contributes significantly to the user's carbon footprint.
3. Generate EXACTLY 3 specific, practical, and actionable reduction tips for each activity.
4. Prioritize recommendations that will have the highest environmental impact.
5. The weekly summary must:
   - Mention the user's biggest emission source.
   - Mention its approximate contribution to the overall footprint.
   - Suggest one realistic improvement.
   - Be under 70 words.
6. Use ONLY the activities provided.
7. NEVER invent additional activities.
8. If fewer than three activities are provided, generate recommendations only for those activities.
9. Return ONLY valid JSON.
10. Do NOT wrap the response inside markdown.
11. Do NOT add explanations before or after the JSON.

Required JSON format:

{
  "weeklySummary": "string",
  "recommendations": [
    {
      "activity": "string",
      "reason": "string",
      "tips": [
        "string",
        "string",
        "string"
      ]
    }
  ]
}

User Activity Summary:

""", activities.size(), totalEmission));

        for (ActivityEmissionSummary activity : activities) {

            double contribution =
                    totalEmission == 0
                            ? 0
                            : (activity.getTotalEmission() / totalEmission) * 100;

            prompt.append(String.format("""
Category: %s
Activity: %s
Total Emission: %.2f kg CO₂
Contribution: %.2f%%
Frequency: %d
Total Quantity: %.2f

""",
                    activity.getCategory(),
                    activity.getActivityType(),
                    activity.getTotalEmission(),
                    contribution,
                    activity.getFrequency(),
                    activity.getTotalQuantity()));
        }

        return prompt.toString();
    }
}