package com.vlladislavii.boardroot.service;

import com.vlladislavii.boardroot.dto.*;
import com.vlladislavii.boardroot.model.BoardGame;
import com.vlladislavii.boardroot.repository.BoardGameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BoardGameService {

    private final BoardGameRepository gameRepository;

    // TODO: change game copies logic
    public List<BoardGameDTO> getAllGames() {
        return gameRepository.findAll().stream()
                .map(BoardGameDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public BoardGameDTO getGameById(Long id) {
        BoardGame game = gameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        return BoardGameDTO.fromEntity(game);
    }

    public List<BoardGameDTO> getGamesByGenre(String genre) {
        return gameRepository.findByGenre(genre).stream()
                .map(BoardGameDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<BoardGameDTO> searchGames(String query) {
        return gameRepository.findByTitleContainingIgnoreCase(query).stream()
                .map(BoardGameDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<BoardGameDTO> getAvailableGames() {
        return gameRepository.findAvailableGames().stream()
                .map(BoardGameDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<BoardGameDTO> getLowStockGames() {
        return gameRepository.findLowStockGames().stream()
                .map(BoardGameDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public BoardGameDTO createGame(CreateGameRequest request) {
        BoardGame game = BoardGame.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .genre(request.getGenre())
                .minPlayers(request.getMinPlayers())
                .maxPlayers(request.getMaxPlayers())
                .duration(request.getDuration())
                .complexity(request.getComplexity())
                .designer(request.getDesigner())
                .yearPublished(request.getYearPublished())
                .totalCopies(request.getTotalCopies())
                .availableCopies(request.getTotalCopies())
                .pricePerHour(request.getPricePerHour())
                .imageUrl(request.getImageUrl())
                .rulebookUrl(request.getRulebookUrl())
                .build();

        BoardGame savedGame = gameRepository.save(game);
        return BoardGameDTO.fromEntity(savedGame);
    }

    @Transactional
    public BoardGameDTO updateGame(Long id, CreateGameRequest request) {
        BoardGame game = gameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        game.setTitle(request.getTitle());
        game.setDescription(request.getDescription());
        game.setGenre(request.getGenre());
        game.setMinPlayers(request.getMinPlayers());
        game.setMaxPlayers(request.getMaxPlayers());
        game.setDuration(request.getDuration());
        game.setComplexity(request.getComplexity());
        game.setDesigner(request.getDesigner());
        game.setYearPublished(request.getYearPublished());
        game.setPricePerHour(request.getPricePerHour());
        game.setImageUrl(request.getImageUrl());
        game.setRulebookUrl(request.getRulebookUrl());

        BoardGame savedGame = gameRepository.save(game);
        return BoardGameDTO.fromEntity(savedGame);
    }

    @Transactional
    public BoardGameDTO updateCopies(Long id, Integer totalCopies) {
        BoardGame game = gameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        int rentedCopies = game.getTotalCopies() - game.getAvailableCopies();
        int newAvailable = Math.max(0, totalCopies - rentedCopies);

        game.setTotalCopies(totalCopies);
        game.setAvailableCopies(newAvailable);

        BoardGame savedGame = gameRepository.save(game);
        return BoardGameDTO.fromEntity(savedGame);
    }

    @Transactional
    public void deleteGame(Long id) {
        if (!gameRepository.existsById(id)) {
            throw new RuntimeException("Game not found");
        }
        gameRepository.deleteById(id);
    }

    @Transactional
    public void decrementAvailableCopies(Long gameId) {
        BoardGame game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        if (game.getAvailableCopies() <= 0) {
            throw new RuntimeException("No copies available");
        }

        game.setAvailableCopies(game.getAvailableCopies() - 1);
        gameRepository.save(game);
    }

    @Transactional
    public void incrementAvailableCopies(Long gameId) {
        BoardGame game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        if (game.getAvailableCopies() < game.getTotalCopies()) {
            game.setAvailableCopies(game.getAvailableCopies() + 1);
            gameRepository.save(game);
        }
    }
}
