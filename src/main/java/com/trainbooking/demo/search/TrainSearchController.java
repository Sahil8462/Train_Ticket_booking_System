package com.trainbooking.demo.search;

import com.trainbooking.demo.booking.BookingSelectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
public class TrainSearchController {

    @Autowired
private BookingSelectionService bookingSelectionService;

    @Autowired
    private TrainSearchService trainSearchService;

    @Autowired
    private SearchIntegrationService searchIntegrationService;

    // ✅ Existing internal DB search (unchanged)
    @GetMapping
    public List<Object[]> searchTrain(
            @RequestParam String from,
            @RequestParam String to
    ) {
        return trainSearchService.searchTrain(from, to);
    }

    // ✅ NEW: External station search (autocomplete ke liye)
   @GetMapping("/external/stations")
public String searchStationsFromExternal(@RequestParam String code) {
    return searchIntegrationService.searchStations(code);
}

@GetMapping("/external/trains-between-stations")
public String getTrainsBetweenStationsFromExternal(
        @RequestParam String startStationCode,
        @RequestParam String endStationCode,
        @RequestParam String date
) {
    return searchIntegrationService.getTrainsBetweenStations(startStationCode, endStationCode, date);
}

@GetMapping("/combined")
public Object searchCombined(
        @RequestParam String from,
        @RequestParam String to,
        @RequestParam String date
) {
    List<Object[]> internalResults = trainSearchService.searchTrain(from, to);

    if (internalResults != null && !internalResults.isEmpty()) {
        List<TrainSearchResponseDto> response = new java.util.ArrayList<>();

        for (Object[] row : internalResults) {
            response.add(mapInternalResult(row));
        }

        return response;
    }

    return getFallbackTrainResults();
}
private TrainSearchResponseDto mapInternalResult(Object[] row) {
    TrainSearchResponseDto dto = new TrainSearchResponseDto();

    dto.setTrainNumber(row[1] != null ? String.valueOf(row[1]) : "");
    dto.setTrainName(row[2] != null ? String.valueOf(row[2]) : "");
    dto.setSourceStation(row[3] != null ? String.valueOf(row[3]) : "");
    dto.setDestinationStation(row[4] != null ? String.valueOf(row[4]) : "");
    dto.setDepartureTime(row[5] != null ? String.valueOf(row[5]) : "");
    dto.setArrivalTime(row[6] != null ? String.valueOf(row[6]) : "");
    dto.setSourceType("INTERNAL");

    return dto;
}

private java.util.List<TrainSearchResponseDto> getFallbackTrainResults() {
    java.util.List<TrainSearchResponseDto> fallbackList = new java.util.ArrayList<>();

    fallbackList.add(new TrainSearchResponseDto(
            "12345",
            "Demo Express",
            "NDLS",
            "BCT",
            "10:00:00",
            "20:00:00",
            "FALLBACK"
    ));

    return fallbackList;
}

@PostMapping("/select-train")
public BookingInitResponseDto selectTrain(@RequestBody SelectedTrainRequestDto request) {
    System.out.println("Selected train received: " + request.getTrainNumber() + " - " + request.getTrainName());
    return bookingSelectionService.initializeBooking(request);
}

@GetMapping("/selected-train")
public SelectedTrainRequestDto getSelectedTrain(@RequestParam String draftId) {
    return bookingSelectionService.getSelectedTrainDraft(draftId);
}
}