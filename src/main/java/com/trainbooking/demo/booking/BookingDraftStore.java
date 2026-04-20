package com.trainbooking.demo.booking;

import org.springframework.stereotype.Component;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;
import java.util.UUID;
import com.trainbooking.demo.search.SelectedTrainRequestDto;

@Component
public class BookingDraftStore {

    private final Map<String, SelectedTrainRequestDto> draftStore = new ConcurrentHashMap<>();

    public String saveDraft(SelectedTrainRequestDto request) {
        String draftId = UUID.randomUUID().toString();
        draftStore.put(draftId, request);
        return draftId;
    }

    public SelectedTrainRequestDto getDraft(String draftId) {
        return draftStore.get(draftId);
    }
}