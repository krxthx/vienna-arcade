# Build an Interactive Applied AI Booth Game App

You are a senior frontend engineer and creative interaction designer. Build a polished, playful, interactive web application featuring two mini-games for an annual corporate technology event.

The booth represents **Project Vienna**, an AI benchmarking and evaluation platform. The games should introduce visitors to Applied AI concepts through short, engaging interactions.

The experience should feel like a modern technology arcade, not an educational quiz application or traditional corporate dashboard.

## 1. Technology

Use:
- Next.js (App Router), TypeScript
- Tailwind CSS
- shadcn/ui where appropriate
- Lucide icons
- Framer Motion / Motion for animations

Prefer client-side functionality. No database, authentication, LLM API, or backend is required for the MVP.

All game content must be configurable through typed TypeScript data structures, rather than hardcoded into individual UI components.

Build an actual working application, not a static mockup.

## 2. Experience and Design

The application will run on a laptop or large touchscreen at a physical event booth.

Visual direction:
- Playful, creative, polished, and modern
- Inspired by mini arcade games and interactive technology exhibits
- Strong typography and subtle technical illustrations
- Dark navy or near-black base, with electric blue, violet, teal, and orange accents
- Beautiful micro-interactions, animated cards, responsive drag-and-drop
- Large interaction targets
- Minimal reading and cognitive overhead
- Visually exciting without becoming childish
- No excessive gradients, glassmorphism, or dashboard-like layouts

Prioritize desktop and landscape touchscreen layouts, while keeping the interface responsive.

Each game should take approximately 30–60 seconds to play.

## 3. Application Structure

### Home Screen

Display a strong headline, such as:

**THE APPLIED AI ARCADE**

Subtitle: "Think. Build. Connect."

Present two large, visually distinct game cards:

**Game 1: Architect the Agent**
"Build the right AI harness for the job."

**Game 2: Find the Connection**
"Discover the hidden connections in Applied AI."

Each card should include:
- An interesting visual illustration
- Difficulty indicator
- Estimated play duration
- Play button

Include a subtle Project Vienna attribution, but avoid overwhelming the games with branding.

## 4. Game 1: Architect the Agent

### Concept

Participants are presented with a simple real-world AI use case and must construct an appropriate agent harness using interactive components.

This should be a lightweight architecture-building challenge, not an unrestricted workflow builder.

### Example Scenario

**"Build an assistant that researches the latest company news and summarizes the findings."**

Available draggable components:
- LLM / Model
- Web Search Tool
- Memory
- Calculator
- Research Skill
- Email Tool
- Subagent
- Database
- Human Approval
- Evaluation

Players must choose the appropriate components and place them into a simplified architecture workspace.

### Gameplay

1. Display a short scenario.
2. Show a palette of available components.
3. Provide 2–4 empty slots or zones to build the harness.
4. Players drag components into the architecture.
5. Allow rearranging or removing components.
6. Provide a "Run Evaluation" button.
7. Evaluate the configuration against predefined rules.
8. Show a quick animated result and short explanation.

Avoid complex wiring, configurable graphs, or requiring users to understand orchestration frameworks.

### Scoring

Use deterministic rules.

For example:
- Required components selected: positive points
- Unnecessary components selected: deductions
- Correct component placement or execution order: positive points
- Missing essential capability: deductions

Support multiple valid configurations when appropriate.

Do not treat optional components as universally wrong.

The feedback should explain what the selected configuration enables and what is missing.

### Scenario Bank

Create at least 8 configurable scenarios, including:

1. Research assistant using live web information
2. Customer-support RAG assistant
3. Invoice extraction and validation
4. Data analysis assistant
5. Meeting scheduling assistant
6. Code review assistant
7. Multi-step research agent
8. Sensitive operation requiring human approval

Each scenario should define:
- Title and description
- Component choices
- Required components
- Optional components
- Distractor components
- Valid arrangements, if order matters
- Explanation
- Difficulty

For the MVP, show one random scenario per play session.

## 5. Game 2: Find the Connection

### Concept

A fast, Connections-inspired Applied AI word game.

Show four clues or visual tiles. Participants must identify the common AI concept connecting them.

The game should be entertaining and accessible to engineers with varying levels of AI knowledge.

This is not a complicated word-grid puzzle.

### Example

Display four tiles:

- Tokens
- Context Window
- Truncation
- Summarization

Question:

**"What connects these?"**

Answer: **Context Management**

Another example:

- Precision
- Recall
- F1 Score
- Confusion Matrix

Answer: **Classification Evaluation**

### Gameplay

1. Show four animated clue tiles.
2. Participants select the correct connecting concept from three choices.
3. Provide optional progressive hints.
4. Reveal the connection using a satisfying animation.
5. Show one short explanation.

Aim for approximately 15–25 seconds per puzzle.

### Puzzle Bank

Create at least 15 puzzles across these topics:

- Evaluation metrics
- Agent harnesses
- Tool calling
- Context engineering
- Prompt caching
- RAG
- Model routing
- GPU inference
- Token optimization
- Multi-agent systems
- Hallucinations and grounding
- Human-in-the-loop
- Reliability and retries
- Latency optimization
- Observability

Some puzzles should use icons or simple illustrations rather than only text.

Avoid obscure trivia or overly academic questions.

Every puzzle must have an unambiguous correct answer and plausible distractors.

For the MVP, randomly select one puzzle per play session.

## 6. Vienna Bonus Question

After either game, display one quick question connected to AI evaluation and Project Vienna.

The question should communicate a relevant evaluation concept, without assuming visitors already know the product.

Examples:

**Q: A model has 95% accuracy but takes 20 seconds to respond. What else should we evaluate?**

A. Latency  
B. Temperature  
C. Context window

Correct: A

**Q: Why benchmark two AI models on the same dataset?**

A. To compare their performance consistently  
B. To increase their context windows  
C. To train both models

Correct: A

Make these questions configurable. Include at least 10.

The bonus question should take approximately 10 seconds.

Do not invent proprietary Project Vienna features. Use general evaluation concepts until actual product-specific content is supplied.

## 7. Results Screen

After the mini-game and bonus question, display:

- A fun, short result message
- Player's score
- A simple explanation of what they learned
- A prominent "Play Again" button
- A "Back to Games" button

Possible result titles:

- "Evaluation Complete!"
- "Harness Approved!"
- "Connection Found!"
- "One More Iteration?"

Avoid elaborate ranking systems.

The physical prizes will be distributed by booth organizers, not managed by the application.

No leaderboard, accounts, personal information collection, or persistent user profiles are required.

## 8. Booth-Friendly Details

Include:
- Easy return to home
- A clear restart control
- Random challenges for replayability
- An optional hint
- Fast animations that can be skipped
- Clear feedback
- Accessible color contrast
- Keyboard and mouse support
- Touchscreen-friendly interactions
- A click-to-select fallback for drag-and-drop
- Proper cleanup of game state between sessions

Do not introduce timers that force users to hurry. An optional visual countdown may be added if it genuinely improves the experience.

## 9. Content and Architecture

Structure the code cleanly:

- Shared game shell and navigation
- Reusable game cards
- Architecture component palette
- Harness workspace
- Deterministic harness evaluation utility
- Connections puzzle component
- Bonus question component
- Results component
- Typed scenario and puzzle definitions

Separate game rules, content, and UI.

Avoid unnecessary abstractions, dependencies, or backend infrastructure.

Ensure both games can easily be expanded with additional content.

## 10. Quality Expectations

- High-quality visual design
- Smooth but restrained animation
- Fully functional interactions
- Clean TypeScript types
- No placeholder gameplay
- No dead buttons
- No external APIs required
- No unnecessary network calls
- Responsive design
- Proper error handling and reset behavior
- No broken game states

Write tests for deterministic game evaluation logic where practical.

## 11. Implementation Instructions

1. Inspect the existing repository before making changes.
2. If there is already an application, follow its conventions and reuse its dependencies where appropriate.
3. If the repository is empty, scaffold the application.
4. Implement both complete games.
5. Populate the scenario and puzzle banks.
6. Add the Vienna bonus question flow.
7. Build the results and replay experience.
8. Run lint, type checks, tests, and production build.
9. Fix any issues discovered.
10. Provide a concise README with local setup and deployment instructions.

Make reasonable product and design decisions independently.

**Prioritize a genuinely enjoyable, visually polished, playable experience over architectural complexity. The finished application should feel like something visitors would voluntarily try at a tech booth, not a training module.**