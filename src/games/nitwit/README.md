# NitWit

A party game so witty it's silly.

Roadmap:

* [X] Setup: Generate "rounds" to assign prompts to players. For example, 4 players, 3 rounds, the first two rounds each player gets two prompts, and each prompt goes to two players and the last round each player gets the same prompt.
* Phases:
    * [X] "Respond" phase.
        * Each player gets a chance to respond to their prompts.
        * Turn Order: ANY
        * Moves: "answerPrompt"
        * End If: All players have answered all prompts
        * Next: Vote
    * [X] "Vote" phase.
        * Each prompt for the round is presented to all the players who did not answer it. These players all vote for their favorite.
        * Turn Order: ANY_ONCE
        * Moves: "votePrompt:
        * End If: All players have voted
        * Next: "Prompt Score"
    * [ ] "Prompt Score" phase.
        * After everyone votes for a prompt, the scores are shown for that prompt.
        * Turn Order: ANY_ONCE or Custom (whenever somebody says "skip", it skips)
        * Moves: "skipPromptScore"
        * Next: if more prompts in round, "Vote", else "RoundScore"
    * [ ] "Round score".
        * After all the prompts are voted on for a round, the total scores are shown.
        * Turn Order: ANY_ONCE or Custom (whenever somebody says "skip", it skips)
        * Moves: "skipRoundScore"
        * Next: if more rounds, "Respond", else "GameScore"
    * [ ] "Game score". After all the rounds have completed, the total game score is shown. May be folded into "Round score".
* Board:
    * [X] "Respond". Show the prompt text, an input, and a "waiting..." after answering all prompts
    * [ ] "Vote". Show the prompt text and the list of answers. If you answered it, show a "waiting for votes" message instead.
    * [ ] "Prompt Score". Show the prompt, each answer, and the players who voted for them and the number of points that earned the player
    * [ ] "Round Score". Show each player, their score before the round, the points they earned that round, and their total score.
    * [ ] "Game Score". Show each player and their total game score.