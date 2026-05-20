package com.vlladislavii.boardroot.controller;

import com.vlladislavii.boardroot.dto.*;
import com.vlladislavii.boardroot.service.BoardGameService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
public class BoardGameController {

    private final BoardGameService gameService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BoardGameDTO>>> getAllGames() {
        List<BoardGameDTO> games = gameService.getAllGames();
        return ResponseEntity.ok(ApiResponse.success(games));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BoardGameDTO>> getGameById(@PathVariable Long id) {
        BoardGameDTO game = gameService.getGameById(id);
        return ResponseEntity.ok(ApiResponse.success(game));
    }

    @GetMapping("/genre/{genre}")
    public ResponseEntity<ApiResponse<List<BoardGameDTO>>> getGamesByGenre(@PathVariable String genre) {
        List<BoardGameDTO> games = gameService.getGamesByGenre(genre);
        return ResponseEntity.ok(ApiResponse.success(games));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<BoardGameDTO>>> searchGames(@RequestParam String query) {
        List<BoardGameDTO> games = gameService.searchGames(query);
        return ResponseEntity.ok(ApiResponse.success(games));
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<BoardGameDTO>>> getAvailableGames() {
        List<BoardGameDTO> games = gameService.getAvailableGames();
        return ResponseEntity.ok(ApiResponse.success(games));
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<BoardGameDTO>>> getLowStockGames() {
        List<BoardGameDTO> games = gameService.getLowStockGames();
        return ResponseEntity.ok(ApiResponse.success(games));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BoardGameDTO>> createGame(@Valid @RequestBody CreateGameRequest request) {
        BoardGameDTO game = gameService.createGame(request);
        return ResponseEntity.ok(ApiResponse.success("Game created successfully", game));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BoardGameDTO>> updateGame(
            @PathVariable Long id,
            @Valid @RequestBody CreateGameRequest request) {
        BoardGameDTO game = gameService.updateGame(id, request);
        return ResponseEntity.ok(ApiResponse.success("Game updated successfully", game));
    }

    @PatchMapping("/{id}/copies")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BoardGameDTO>> updateCopies(
            @PathVariable Long id,
            @RequestParam Integer totalCopies) {
        BoardGameDTO game = gameService.updateCopies(id, totalCopies);
        return ResponseEntity.ok(ApiResponse.success("Copies updated successfully", game));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteGame(@PathVariable Long id) {
        gameService.deleteGame(id);
        return ResponseEntity.ok(ApiResponse.success("Game deleted successfully", null));
    }
}
