package com.trainbooking.demo.booking;

import org.springframework.stereotype.Service;
import com.trainbooking.demo.search.BookingInitResponseDto;
import com.trainbooking.demo.search.SelectedTrainRequestDto;

@Service
public class BookingSelectionService {

    private final BookingDraftStore bookingDraftStore;

    public BookingSelectionService(BookingDraftStore bookingDraftStore) {
        this.bookingDraftStore = bookingDraftStore;
    }

    public BookingInitResponseDto initializeBooking(SelectedTrainRequestDto request) {
        String draftId = bookingDraftStore.saveDraft(request);

        BookingInitResponseDto response = new BookingInitResponseDto();

        response.setDraftId(draftId);
        response.setTrainNumber(request.getTrainNumber());
        response.setTrainName(request.getTrainName());
        response.setSourceStation(request.getSourceStation());
        response.setDestinationStation(request.getDestinationStation());
        response.setDepartureTime(request.getDepartureTime());
        response.setArrivalTime(request.getArrivalTime());
        response.setJourneyDate(request.getJourneyDate());
        response.setSourceType(request.getSourceType());

        response.setBookingStatus("INITIATED");
        response.setMessage("Train selected successfully. Proceed to passenger details.");

        return response;
    }

    public SelectedTrainRequestDto getSelectedTrainDraft(String draftId) {
    return bookingDraftStore.getDraft(draftId);
}
}