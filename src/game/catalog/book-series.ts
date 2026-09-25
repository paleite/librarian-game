import { BookSeriesSchema, type BookSeries } from "./schema";
import { sections } from "./sections";

type RawSeries = readonly [title: string, volumeCount: 3 | 5 | 10];

const rawSeriesBySection = {
  "1A": [
    [
      "A Field Guide to Monsters: Identification and Survival",
      10
    ],
    [
      "A Pictorial Guide to the Ecology of Monsters",
      10
    ],
    [
      "Behavioral Patterns of Monsters",
      10
    ],
    [
      "Ecological Pyramid of Monsters",
      10
    ],
    [
      "Living with Monsters: A Guide to Care and Training",
      10
    ],
    [
      "Magical Creatures and Their Spells",
      10
    ],
    [
      "Monster Field Notes: A Beastmaster's Journey",
      10
    ],
    [
      "Monsterology: An Introduction to Forbidden Beast",
      10
    ],
    [
      "Monsterology: Language and Vocal Patterns of Monsters",
      10
    ],
    [
      "Tears of the Beasts: Records of the Extinct and Forgotten",
      10
    ],
    [
      "The Illustrated Bestiary: Creatures of Land, Sky, and Sea",
      10
    ],
    [
      "The World Encyclopedia of Dragons",
      10
    ]
  ],
  "1B": [
    [
      "Animal Oracles: Prophesying Match Results",
      10
    ],
    [
      "Apocalypse of the Heavens, Omens and Warnings",
      10
    ],
    [
      "Book of Constellations: The Thirteen Zodiac Signs That Guide Destiny",
      10
    ],
    [
      "One Right Guess in a Hundred Makes a Seer",
      10
    ],
    [
      "Prophecy by the Three Witches",
      10
    ],
    [
      "Prophecy of the Advent of the Great King of Terror",
      10
    ],
    [
      "Prophecy: Angelic Self-Writing",
      10
    ],
    [
      "The Abyss of Tarot: A Book of Symbols and Intuition",
      10
    ],
    [
      "The Art of Feng Shui: Reading Dragon Veins and Increasing Luck",
      10
    ],
    [
      "The Crystal Tome: Practical Scrying and Clairvoyance",
      10
    ],
    [
      "The Seer's Journal: Daily Visions of the Future",
      10
    ],
    [
      "Voices of the Oracle: Revelations for the Chosen Listener",
      10
    ]
  ],
  "1C": [
    [
      "Advanced Curse Analysis: Multiple Structures and Dissolution Process",
      3
    ],
    [
      "Breaking the Curse of the Trophyless",
      3
    ],
    [
      "Curse-Breaking Arithmancy and Sealing Arts",
      3
    ],
    [
      "Introduction to Malediction Systems: Taxonomy, Structure, and Mechanisms",
      3
    ],
    [
      "Reverse Ritual Tracing for Curse Source Identification",
      3
    ],
    [
      "Seal and Sever: Lost Rites of Curse-Breaking",
      10
    ],
    [
      "The Book of Curses: Forgotten Plagues and Their Dispells",
      3
    ],
    [
      "The Countercurse Compendium: Magic That Bites Back",
      10
    ],
    [
      "The Dark Pact: The Birth of a Curse",
      10
    ],
    [
      "The Death's Note",
      3
    ],
    [
      "The Grand Compendium of Curses: 100 Hexes and 100 Dispells",
      10
    ],
    [
      "The Lexicon of Curses: Malefic Words and Their Power",
      3
    ]
  ],
  "1D": [
    [
      "A Collection of Chanted Verses: Status Buffing and Nerfing",
      10
    ],
    [
      "Chanting Methods of Resonating with Natural Entities",
      3
    ],
    [
      "Magical Psalms: Methodology for Compiling Chanted Poetry",
      3
    ],
    [
      "Musical Saint: A Great Figure Who Brought Music to the Masses",
      3
    ],
    [
      "Spell Chanting Technique: The Blending of Sound and Spell",
      10
    ],
    [
      "The Bard's Book of Spells",
      3
    ],
    [
      "The Chronicle of World Music of Magic",
      10
    ],
    [
      "The Dark Sonata: Music That Attracts Calamity",
      10
    ],
    [
      "Theoretical Foundations of Enchanted Music",
      3
    ],
    [
      "Theory of Chanting: Principles of Mana Amplification via Voice",
      3
    ],
    [
      "Transcendental Magic Etudes of Execution",
      3
    ],
    [
      "Witches' Hymnal",
      3
    ]
  ],
  "1E": [
    [
      "A Technique to Turn Wandering Ghosts into Servants",
      10
    ],
    [
      "Compendium of Necromancy: The Arts of Management and Maintenance",
      10
    ],
    [
      "Compendium of Necromancy: The Beginner's Guide",
      10
    ],
    [
      "Foundations of Necromancy: On the Fixation and Severance of Souls",
      10
    ],
    [
      "How to Command the Army of the Dead",
      10
    ],
    [
      "Necrodefense Compendium: Dealing with Hauntings",
      10
    ],
    [
      "Night Parade of One Hundred Demons",
      10
    ],
    [
      "Practical Necromancy: Skeleton Edition",
      10
    ],
    [
      "Ritual Design Guidelines for the Practicing Necromancer",
      10
    ],
    [
      "Rituals of Calling and Commanding the Dead",
      10
    ],
    [
      "Theory of the Nether Strata: Analysis of the Afterworld",
      10
    ],
    [
      "Zombie: The Secret Rituals for Domination",
      10
    ]
  ],
  "1F": [
    [
      "Beastification and the Threshold of Madness",
      10
    ],
    [
      "Complete Practical Transfiguration: Phases and Sustaining Techniques",
      10
    ],
    [
      "Correlation of Transformation Duration and Mana Depletion",
      10
    ],
    [
      "Foundations of Transformation: Object Alteration and Reassembly",
      10
    ],
    [
      "Humanization: A Transformation Guide for Non-Humans",
      10
    ],
    [
      "Introduction to Inanimate Transfiguration",
      10
    ],
    [
      "Introduction to the Theory of Transfiguration",
      10
    ],
    [
      "Magical Physiology of Therianthropy",
      10
    ],
    [
      "Mastery of Mimicry: Theory and Practice of Visual Imitation",
      10
    ],
    [
      "Preservation of Mental Identity in Therianthropic Spells",
      10
    ],
    [
      "Reducing Metamorphosis Time: How to Minimize Vulnerability",
      10
    ],
    [
      "The Codex of Transfiguration: Detection and Nullification",
      10
    ]
  ],
  "1G": [
    [
      "Artifacts That Change The World",
      3
    ],
    [
      "Compendium of Forbidden Relics",
      3
    ],
    [
      "Crystal Catalog: Elemental Properties and Enchantment Mastery",
      3
    ],
    [
      "Forging Magical Items",
      3
    ],
    [
      "Foundations of Magical Item Crafting and Materials",
      10
    ],
    [
      "Introduction to Enchantment Theory",
      3
    ],
    [
      "Magical Item's Workshop Series",
      10
    ],
    [
      "Practical Enchantment: Offense and Defense Enhancement",
      10
    ],
    [
      "Repair and Returning of Enchanted Gear",
      3
    ],
    [
      "The Grand Encyclopedia of Magical Artifacts",
      10
    ],
    [
      "The Inverse Law of High Grade Armor and Fabric Coverage",
      3
    ],
    [
      "The Magic Ring That Steals Reason",
      3
    ]
  ],
  "1H": [
    [
      "Codex of the Stealth Arts",
      10
    ],
    [
      "Complete Guide to Stealth Magic",
      10
    ],
    [
      "Foundations and Applications of Invisibility Magic",
      3
    ],
    [
      "Hide vs Seek: Magical Warfare of Stealth and Detection",
      10
    ],
    [
      "Introduction to Stealth Magic: The Art of Shadowing",
      3
    ],
    [
      "Shadowmages: Shadow Cloning and Teleportation",
      3
    ],
    [
      "Stealth Arts: Techniques to Becoming Air",
      3
    ],
    [
      "Stealth Techniques: Concealment Among Nearby Objects",
      10
    ],
    [
      "Tactics of the Bucket: Vision-Sealing Theft",
      3
    ],
    [
      "The Art of Hiding One's Presence",
      3
    ],
    [
      "The Art of Shadow Walking",
      3
    ],
    [
      "The Book of Ninja: Lurking in the Darkness",
      3
    ]
  ],
  "1I": [
    [
      "Chronostatic Illusions: Manipulating the Perception of Time",
      10
    ],
    [
      "Crafting Visual and Auditory Illusions",
      10
    ],
    [
      "Enchanting Illusions: Seduction Magic",
      10
    ],
    [
      "Illusion Magic: The Art of Hypnosis",
      10
    ],
    [
      "Introduction to Illusion Magic: Truths of the Imaginary",
      10
    ],
    [
      "Terror Illusions: Spells to Shatter the Enemy's Mind",
      10
    ],
    [
      "The Art of Illusion Defense: Mental Defences and Protection of the Five Senses",
      10
    ],
    [
      "The Grand Compendium of Illusion Magic",
      10
    ],
    [
      "The Illusory Art: Sovereignty over the Five Senses",
      10
    ],
    [
      "The Infinite Hall: Creating Inescapable Illusory Spaces",
      10
    ],
    [
      "The Ultimate Illusion: Mirror Flower, Water Moon",
      10
    ],
    [
      "Where Illusion Ends and Reality Begins",
      10
    ]
  ],
  "1J": [
    [
      "A Beginner's Guide: Summoning the Useless Goddess",
      10
    ],
    [
      "Divine Dragon Summoning: Descent of Bahamut",
      10
    ],
    [
      "Encyclopedia of 10,000 Summons: The Complete Collection from Heaven to the Abyss",
      10
    ],
    [
      "Introduction to Summoning: Fundamentals of Otherworldly Contracts",
      10
    ],
    [
      "Magic Circles and Summoning Syntax Explained",
      10
    ],
    [
      "Succubus Summoning Techniques and Practical Applications",
      10
    ],
    [
      "Summoning Magic for Beginners",
      10
    ],
    [
      "Summoning and Controlling Catastrophic Entities",
      10
    ],
    [
      "The Book of Summoning and Contracts",
      10
    ],
    [
      "The Complete Summoning Grimoire",
      10
    ],
    [
      "Theory and Practice of Hero Summoning from Another World",
      10
    ],
    [
      "Trans-Temporal Summons and the Law of Causality",
      10
    ]
  ],
  "1K": [
    [
      "Advanced Healing Theory: Maintaining Vigor Until Daybreak",
      10
    ],
    [
      "Fundamentals of Healing and Mana Control",
      10
    ],
    [
      "Healing Magic for the Reclamation of Mind and Consciousness",
      10
    ],
    [
      "Introduction to Magical Healing",
      10
    ],
    [
      "No More \"Healer Diff\": A Comprehensive Guide",
      10
    ],
    [
      "Spells for Curing Poisons and Diseases",
      10
    ],
    [
      "The Four Principles of the Healer's Ethics",
      10
    ],
    [
      "The Grand Compendium of Healing Magic",
      10
    ]
  ],
  "1L": [
    [
      "Compendium of Sacred Purification Magic",
      10
    ],
    [
      "Formation and Maintenance of Large Sacred Barriers",
      10
    ],
    [
      "Fundamentals of Holy Power in Undead Annihilation",
      10
    ],
    [
      "Holy Magic: Undead Protection and Purification",
      10
    ],
    [
      "Prolegomena to Holy Magic Theory",
      10
    ],
    [
      "Selection and Application of Targets for Holy Magic",
      10
    ],
    [
      "Spells of Holy Light for Concealing Vital Areas",
      10
    ],
    [
      "Theological Research on Holy Magic",
      10
    ]
  ],
  "1M": [
    [
      "Book of Spells: Abyss - Master",
      5
    ],
    [
      "Book of Spells: Dimension Rift - Expert",
      10
    ],
    [
      "Book of Spells: Earth - Novice",
      10
    ],
    [
      "Book of Spells: Energy - Legendary",
      5
    ],
    [
      "Book of Spells: Explosion - Legendary",
      5
    ],
    [
      "Book of Spells: Fire - Novice",
      10
    ],
    [
      "Book of Spells: Fluid - Expert",
      10
    ],
    [
      "Book of Spells: Forest Creation - Expert",
      10
    ],
    [
      "Book of Spells: Gravitation - Master",
      5
    ],
    [
      "Book of Spells: Ice - Adept",
      10
    ],
    [
      "Book of Spells: Light - Adept",
      10
    ],
    [
      "Book of Spells: Matter Creation - Master",
      5
    ],
    [
      "Book of Spells: Psychokinesis - Master",
      5
    ],
    [
      "Book of Spells: Pulverization - Expert",
      10
    ],
    [
      "Book of Spells: Shadow - Adept",
      10
    ],
    [
      "Book of Spells: Space - Legendary",
      5
    ],
    [
      "Book of Spells: Thunder - Adept",
      10
    ],
    [
      "Book of Spells: Time - Legendary",
      5
    ],
    [
      "Book of Spells: Water - Novice",
      10
    ],
    [
      "Book of Spells: Wind - Novice",
      10
    ]
  ],
  "1N": [
    [
      "Alchemy Codex: An Introduction to Herbology",
      10
    ],
    [
      "Books of Alchemy: A Practical Guide to Potion Crafting",
      10
    ],
    [
      "Books of Alchemy: Encyclopedia of World Potions",
      10
    ],
    [
      "Books of Alchemy: Homunculus - Chronicle of the Forbidden Creation",
      10
    ],
    [
      "Books of Alchemy: Potion Safety and Storage Manual",
      10
    ],
    [
      "Books of Alchemy: Practical Extraction of High-Purity Essences",
      10
    ],
    [
      "Books of Alchemy: The Laws and Taboos of Chimera Synthesis",
      10
    ],
    [
      "Books of Alchemy: The Little Herbology of the Faefolk",
      10
    ],
    [
      "Books of Alchemy: The Ultimate Secret of the Philosopher's Stone",
      10
    ],
    [
      "Forbidden Alchemy: The Guide to Toxin Brewing and Disposal",
      10
    ],
    [
      "The Alchemist's Encyclopedia: Categories and Efficacy of Ingredients",
      10
    ],
    [
      "The Alchemist's Field Guide: Natural Materials and Foraging",
      10
    ],
    [
      "Tomes of Alchemy: A Beginner's Guide to Modern Synthesis",
      5
    ],
    [
      "Tomes of Alchemy: A Grimoire of Elemental Fusion and Fission",
      5
    ],
    [
      "Tomes of Alchemy: Alchemical Safety Manual Handling Hazardous Materials",
      5
    ],
    [
      "Tomes of Alchemy: Alchemical Tools and Laboratory Apparatus",
      5
    ],
    [
      "Tomes of Alchemy: Beginner Manual of Alchemical Synthesis",
      5
    ],
    [
      "Tomes of Alchemy: Complete Theory of Elemental Transmutation",
      5
    ],
    [
      "Tomes of Alchemy: The Alchemical Art of Transmuting Food to Poop",
      5
    ],
    [
      "Tomes of Alchemy: The Great Compendium of Synthesis Recipes",
      5
    ]
  ],
  "2A": [
    [
      "Armor and Muscle: Synergy Between Body and Steel",
      10
    ],
    [
      "Battlefield Logic: A Tactical Guide for Warriors",
      10
    ],
    [
      "Blade: Dimension Slash Combat Technique",
      10
    ],
    [
      "Heretic Blade Arts: Three Sword Style",
      10
    ],
    [
      "Mind Like Still Water: The Zen of Perfect Parrying",
      10
    ],
    [
      "Scion of the Axe God: Strongest Warrior Chosen by the Sun",
      10
    ],
    [
      "Sword Saint: The One Who Sliced the Mountains",
      10
    ],
    [
      "The Dark Berserker and the Greatsword",
      10
    ],
    [
      "The Supreme Creed: The Naked Warrior",
      10
    ],
    [
      "The Weapon Compendium: Use of Swords, Axes and Spears",
      10
    ],
    [
      "The Warrior's Creed: Only Cowards Become Long-Range Mages",
      10
    ],
    [
      "Warrior's Foundation: Between Blade and Spell",
      10
    ]
  ],
  "2B": [
    [
      "Anatomy of the Bow and Arrow",
      10
    ],
    [
      "Applied Archery Tactics: Arrows of Stillness and Motion",
      10
    ],
    [
      "Archers of the Fairies Pact",
      10
    ],
    [
      "Arrow of the Shattered Knee",
      10
    ],
    [
      "Forging and Using Magical Bows",
      10
    ],
    [
      "From Longbow to Shortbow: Tactical Applications",
      10
    ],
    [
      "Stellar Archery: Resonance of Stars and Arrows",
      10
    ],
    [
      "The Art of the Arrow Series",
      10
    ],
    [
      "The Book of Arcane Bows: Magic Infused Arrows",
      10
    ],
    [
      "The Fundamentals of Archery: Spirit and Skill",
      10
    ],
    [
      "The Grand Compendium of Archery",
      10
    ],
    [
      "The Hunter's Archery Manual",
      10
    ]
  ],
  "2C": [
    [
      "1000 Easy Spells to Use at Home",
      10
    ],
    [
      "A Compendium of Useless Magic from Around the World",
      10
    ],
    [
      "Broom Handling Techniques: The Art of Aerial Travel",
      3
    ],
    [
      "Compendium Magic for the Lazy",
      3
    ],
    [
      "Everyday Magic for Deep and Restful Sleep",
      3
    ],
    [
      "Handy Kitchen Magic Recipes",
      3
    ],
    [
      "Home Magic: Spells to Protect and Nurture Your Dwelling",
      3
    ],
    [
      "How to Commute with Magic",
      3
    ],
    [
      "Introduction to LifeHack Magic",
      10
    ],
    [
      "Magic Techniques to Boost Household Efficiency",
      10
    ],
    [
      "Magic to Mute a Specific Person's Voice",
      3
    ],
    [
      "Magic to Speak and Convey",
      3
    ],
    [
      "Minor Repairs: Practical Everyday Magic",
      10
    ],
    [
      "Spoiler Prevention Magic",
      3
    ],
    [
      "Storage Magic: Different Dimension Pocket",
      3
    ],
    [
      "The Complete Guide to Everyday Magic: Simple Life Enchantments",
      10
    ],
    [
      "Three Seconds to Office: Magic for Last-Minute Commuters",
      3
    ],
    [
      "What Kind of Magic Works Best for Job Hunting?",
      3
    ]
  ],
  "2D": [
    [
      "Arcane Glyphs and Pattern Theory",
      3
    ],
    [
      "Easy Math! Magical Representation Theory for a 3-Year Old",
      10
    ],
    [
      "Genesis Theory: An Interpretation via Imaginary Numbers",
      3
    ],
    [
      "Introduction to Sorcery Mathematics",
      10
    ],
    [
      "Magical Analysis Based on the Application of Infinite Series",
      3
    ],
    [
      "Mana Measurement and Conversion Equations",
      10
    ],
    [
      "Mass-Mana Equivalence",
      3
    ],
    [
      "Mathematical Methods for Constructing Magic Circles",
      3
    ],
    [
      "Prime Equation: The Absolute Order Hidden Behind Irregularity",
      3
    ],
    [
      "Prophecy and Probability Theory",
      3
    ],
    [
      "Quantification of Cursed Power and Constraint Conditions",
      3
    ],
    [
      "Spatial Distribution of Mana Density and Its Fluctuation Characteristics",
      3
    ],
    [
      "Structural Analysis of Sorcerous Equations",
      10
    ],
    [
      "Temporal Magic and Chaos Theory",
      3
    ],
    [
      "The Law of Equivalent Exchange",
      3
    ],
    [
      "The Mathematical Geometry of Magic Circles",
      10
    ],
    [
      "Theory of Everything: Grasping Beautiful Theory through Equations",
      10
    ],
    [
      "Vector Space Theory of Magic",
      3
    ]
  ],
  "2E": [
    [
      "Art Collection That No One Can Understand",
      10
    ],
    [
      "Art and Magic Circles: Definitions and Differences",
      10
    ],
    [
      "Art is Sublime Because It Has No Answer",
      10
    ],
    [
      "Drawing Moving Characters: Beginner Level",
      10
    ],
    [
      "How to Change Drawn Art into Reality",
      10
    ],
    [
      "Introduction to Magical Art",
      10
    ],
    [
      "Living Paintings: Creating and Controlling Animated Magical Art",
      10
    ],
    [
      "Memory Transfer: The Technique of Direct Scene Depiction from your Brain",
      10
    ],
    [
      "Perfect Lines and Circles: The Secret to Drawing in One Stroke",
      10
    ],
    [
      "Process: Sublimating Brain Fragments into Works",
      10
    ],
    [
      "Puppet Crafting: An Introductory Guide to Automata and Statues",
      10
    ],
    [
      "Techniques for Returning a Drawing to a Previous Step",
      10
    ]
  ],
  "2F": [
    [
      "Conflict Protocols for Guilds",
      10
    ],
    [
      "Guild Treasury and Reward System Management",
      10
    ],
    [
      "Licensing and Regulation of Magic Users",
      10
    ],
    [
      "Magical Supply Chain Management",
      10
    ],
    [
      "Management: Administration of Magical Institutions",
      10
    ],
    [
      "Management: High-Ranking Magician Training and Evaluation System",
      10
    ],
    [
      "Management: Mana Resource Allocation and Optimization",
      10
    ],
    [
      "Management: Tactical Command of Magical Forces",
      10
    ],
    [
      "Managing Diverse and Cross-Race Adventurer Parties",
      10
    ],
    [
      "Organizational Discipline: How Small Cracks Lead to Great Ruin",
      10
    ],
    [
      "Research of Adventurer Party Tactics Series",
      10
    ],
    [
      "Systems for Nurturing and Promotions in Guilds",
      10
    ]
  ],
  "2G": [
    [
      "Alchemy and Inflation: The Gold Collapse",
      3
    ],
    [
      "An Introduction to Magical Economics",
      10
    ],
    [
      "Arcane Economy Report: Regional Mana Market Analysis",
      10
    ],
    [
      "Economics: Supply and Trade of Arcane Resources",
      3
    ],
    [
      "Economics: The Lost Three Decades",
      3
    ],
    [
      "Economics: The Revolution in Logistics Through Teleportation",
      3
    ],
    [
      "Economics: Wage Structures in the Magical Professions",
      10
    ],
    [
      "Economics: Where Did the Taxes Go?",
      3
    ],
    [
      "Financial: The Art of the Tariff",
      3
    ],
    [
      "History of Demonic Financial Hegemony",
      3
    ],
    [
      "Introduction to Arcane Market Systems",
      10
    ],
    [
      "Magic and Value: Arcane Resource Valuations",
      10
    ],
    [
      "Mana Currency Systems and Their Evolution",
      10
    ],
    [
      "Spell Patents and IP Rights",
      3
    ],
    [
      "Studies in Arcane Fiscal Theory",
      3
    ],
    [
      "The Arcane Black Market and Price Manipulation",
      3
    ],
    [
      "The Complete Works of Magical Economics",
      3
    ],
    [
      "Why Do Stocks Crash the Moment I Buy Them?",
      3
    ]
  ],
  "2H": [
    [
      "A Media Society Manipulated by Magic",
      3
    ],
    [
      "Career Opportunity: Graduated from Magic University... Got Zero Job Offers",
      10
    ],
    [
      "How to Survive a Mana-Disparity Society",
      3
    ],
    [
      "Interracial Social Dynamics",
      10
    ],
    [
      "Job Inequality: Low Salary even as a Licensed Sage",
      10
    ],
    [
      "Labor Studies: Even with Magic, Overtime Never Ends",
      10
    ],
    [
      "Labor Studies: Where are the Workplaces to Apply Your University-Learned Magic?",
      3
    ],
    [
      "\"Low Mana\" a Form of Discrimination?",
      3
    ],
    [
      "Mana and Labor: Sociology of Magical Economies",
      3
    ],
    [
      "Marriage Is a Contract Spell: Advanced Disenchantment is required for Divorce",
      3
    ],
    [
      "Social Structures of Magical Civilizations",
      3
    ],
    [
      "Sociology: Mage Pension System on the Brink of Collapse",
      3
    ],
    [
      "The Influence of Short-Lived Cultures on Long-Lived Species",
      10
    ],
    [
      "The Labor Reality of Mages: Unpaid and Unprotected Interns",
      3
    ],
    [
      "The Rift in Values Between Different Species with Differing Lifespans",
      3
    ],
    [
      "The Structure of Power Monopolization Tendencies by Long-Lived Species",
      3
    ],
    [
      "Wage Gaps: Universal Mana Income for Mages Now!",
      3
    ],
    [
      "Work Culture: The Mage Who Changed Jobs to a Sweatshop",
      10
    ]
  ],
  "2I": [
    [
      "A Diary of the Change in the State of the Mind-Reading Girl",
      10
    ],
    [
      "A Psychologist's Definition of \"Happiness\": The Cutting Edge of Happiness Research",
      10
    ],
    [
      "Effort Builds Confidence, and Confidence Leads to Action",
      10
    ],
    [
      "Introduction to Psychological Principles and Analysis",
      10
    ],
    [
      "Mind Reading: Detecting Lies through Facial Expressions and Gestures",
      10
    ],
    [
      "Psychology: Mentality That the Weak Bark the Most",
      10
    ],
    [
      "The Correlation of Magic and Emotion",
      10
    ],
    [
      "The Psychology of Backseat Gaming",
      10
    ],
    [
      "The Psychology of Prioritizing Gaming Over Tidying Your Room",
      10
    ],
    [
      "The Psychology of Using Strong Language from a Safe Zone",
      10
    ],
    [
      "The Psychology: Powerlessness and Responsibility Shifting",
      10
    ],
    [
      "Ultimate Choice: Curry flavoured Poop, or Poop flavoured Curry?",
      10
    ]
  ],
  "2J": [
    [
      "Ethics of Magic: Responsibility and Restraint",
      10
    ],
    [
      "Fantasy or Reality? The Ontological Problem of World",
      10
    ],
    [
      "Foundations of Metaphysics",
      10
    ],
    [
      "I think, therefore I am",
      10
    ],
    [
      "Introduction to Magical Determinism: Spell-Causality and the Philosophy",
      10
    ],
    [
      "Philosophical Studies in Magic",
      10
    ],
    [
      "Philosophy of Mana and Willpower",
      10
    ],
    [
      "Philosophy of Science: Methodology and Truth",
      10
    ],
    [
      "Philosophy of Self and Other",
      10
    ],
    [
      "Philosophy: Power and Ethics",
      10
    ],
    [
      "Soul, Mind, and Body: Are They Truly Distinct",
      10
    ],
    [
      "Teachings of the Great Philosophers of Magic",
      10
    ]
  ],
  "2K": [
    [
      "Chronicles of the Magical Court",
      10
    ],
    [
      "Civil Liability Within Adventuring Parties",
      3
    ],
    [
      "Codex of Truth Verification",
      10
    ],
    [
      "Comparative Study of National Magic Laws",
      3
    ],
    [
      "Compendium of Magical Civil Law: Definition of Personhood, Rights and Succession",
      3
    ],
    [
      "Contract Law: How to Write Adventurer Contracts",
      3
    ],
    [
      "Grand Compendium of Magic Jurisprudence",
      10
    ],
    [
      "Guild Charter: Guild Discipline and Expulsion Systems",
      3
    ],
    [
      "Law: Foundations of Contemporary Magical Jurisprudence",
      10
    ],
    [
      "Legal System for Magical Accidents and Accountability",
      3
    ],
    [
      "Legal Treatment of Forbidden Magic",
      3
    ],
    [
      "Legality and Regulation of Magic Use",
      3
    ],
    [
      "Magical Detective Law: Punishment Act for the Use of Unapproved and Unregistered Spell",
      3
    ],
    [
      "Monster Hunting Law: List of Prohibited Species and Regulation of Attack Methods",
      3
    ],
    [
      "The Constitution of the Kingdom",
      10
    ],
    [
      "The Idea of Equality Under the Law Is Laughable",
      3
    ],
    [
      "The Legalities of Party Disbandment: Property Distribution and Liability",
      3
    ],
    [
      "The System and Precedents of the Arcane Court",
      10
    ]
  ],
  "2L": [
    [
      "30 year old Wizard's First Love",
      3
    ],
    [
      "A Kiss Wrought in Spells",
      10
    ],
    [
      "A Midsummer Night's Sweet Dream",
      10
    ],
    [
      "Cursed to Love You",
      3
    ],
    [
      "Fill The Solitude of My Millennium with Your Ninety Years",
      3
    ],
    [
      "Romance Novel: A Pact Beneath the Stars",
      10
    ],
    [
      "Romance Novel: Lies More Beautiful Than Truth",
      3
    ],
    [
      "Romance Novel: My Massive Golden Balls",
      3
    ],
    [
      "Romance Novel: Senior and the Beast",
      10
    ],
    [
      "Romance Novel: The Chicken and The Cat",
      3
    ],
    [
      "Romance Novel: The Fire King and the Ice Queen",
      10
    ],
    [
      "Romance Novel: The Red Lady and the Bamboozled Men",
      3
    ],
    [
      "Romance Novel: The Thorn Prince",
      3
    ],
    [
      "Romance Novel: Whispers of the Moon",
      10
    ],
    [
      "Roses Are Red, Violets Are Blue",
      3
    ],
    [
      "The Strongest Archmage is Obsessed with Me, the Girl with Zero Magic!",
      3
    ],
    [
      "The Witch and the Accidental Love Potion",
      3
    ],
    [
      "True Love between A 20-Year-Old Lady and an 80-Year-Old Tycoon",
      3
    ]
  ],
  "2M": [
    [
      "Detective the Reaper",
      10
    ],
    [
      "Mystery Fiction: Judgment of the Spectral Tribunal",
      5
    ],
    [
      "Mystery Fiction: Magical Theorist Maris",
      5
    ],
    [
      "Mystery Fiction: One Who Looks into the Abyss",
      5
    ],
    [
      "Mystery Fiction: The Bloodstained Astrologer",
      10
    ],
    [
      "Mystery Fiction: The Pirate Captain Who Stepped Down from His Ship",
      5
    ],
    [
      "Mystery Fiction: The Prospero Code",
      10
    ],
    [
      "The Arcane Detective Files",
      10
    ]
  ],
  "2N": [
    [
      "Ancient Manuscript Studies on Mage Birth",
      5
    ],
    [
      "History and Tactics of Magical Warfare",
      5
    ],
    [
      "Origins of Magic: Awakening of the First Spells and Magic Power",
      10
    ],
    [
      "Record of the Demon King's Subjugation: The Archmage's Conquest",
      5
    ],
    [
      "Studies in the History of Magical Civilizations",
      10
    ],
    [
      "The Genesis of Magic and the Evolution of Civilization",
      10
    ],
    [
      "The History of World Exploration and the Discovery of Lost Continents",
      5
    ],
    [
      "The Transition and Evolutionary History of Magic",
      10
    ]
  ],
  "2O": [
    [
      "A People Enchanted by Glowing Slabs",
      10
    ],
    [
      "A World Without a Demon Lord, Yet Full of Corporate Slaves",
      5
    ],
    [
      "In the Otherworld, Money is the Ultimate Magic",
      5
    ],
    [
      "Otherworld Chronicles: A World Ruled by Data",
      5
    ],
    [
      "Strange Technology from Another World! The Ultimate Language: C++",
      5
    ],
    [
      "The Curious Daily Life in a World Without Magic",
      10
    ],
    [
      "The Cursed Workplaces of a Magicless World",
      10
    ],
    [
      "The Otherworld: Demanding Fresh Graduates with 10 Years of Experience",
      5
    ],
    [
      "The Ultimate Guide to Otherworldly Swear Words",
      5
    ],
    [
      "The \"Internet\": The All-Knowing Grimoire",
      5
    ],
    [
      "They Call Their Mana \"Dark Energy\"",
      10
    ],
    [
      "They Worship an Invisible Entity Known as Wi-Fi",
      5
    ]
  ],
  "2P": [
    [
      "Bestiary Components: Dungeon Creatures",
      10
    ],
    [
      "Compendium of Dungeon Resources",
      10
    ],
    [
      "Dungeon of the Abyss",
      10
    ],
    [
      "Fundamentals of Dungeon Architecture",
      10
    ],
    [
      "Gourmet Expeditions in the Dungeon",
      5
    ],
    [
      "Optimization Theory of Dungeon Routes",
      5
    ],
    [
      "Practical Dungeon Tactics",
      5
    ],
    [
      "The Daily Dungeon Notes of the Party Chronicler",
      5
    ]
  ],
  "2Q": [
    [
      "Everyone's Demonic: Words of Covenant and Power",
      10
    ],
    [
      "Everyone's Dwarvish: The Craftsman's Language",
      10
    ],
    [
      "Everyone's Elvish: The Graceful Speech of the Forest",
      10
    ],
    [
      "Everyone's Fairy Tongue: Tiny and Lovely Words",
      10
    ],
    [
      "How Did the First Language Emerge? The Origins of Language Evolution",
      5
    ],
    [
      "Inter-Species Communication",
      5
    ],
    [
      "The Birth of Magical Languages: Secrets of Spells and Ancient Speech",
      5
    ],
    [
      "The Language of Draconic: Roars of Ancient Wisdom and Primal Power",
      5
    ]
  ]
} as const satisfies Record<string, readonly RawSeries[]>;

const sectionByCode = new Map(sections.map((section) => [section.code, section]));

const generatedSeries = Object.entries(rawSeriesBySection).flatMap(
  ([sectionCode, seriesRows]) => {
    const section = sectionByCode.get(sectionCode);

    if (!section) {
      throw new Error(`Unknown section code: ${sectionCode}`);
    }

    return seriesRows.map(([title, volumeCount], index) => ({
      id: `${sectionCode.toLowerCase()}-${String(index + 1).padStart(2, "0")}`,
      sectionCode,
      title,
      volumeCount,
      visualFamily: section.colorFamily,
    }));
  },
);

export const bookSeries: readonly BookSeries[] =
  BookSeriesSchema.array().length(400).parse(generatedSeries);

export const totalVolumeCount = bookSeries.reduce(
  (sum, series) => sum + series.volumeCount,
  0,
);

if (totalVolumeCount !== 3072) {
  throw new Error(`Expected 3072 physical volumes, got ${totalVolumeCount}`);
}

const uniqueIds = new Set(bookSeries.map((series) => series.id));

if (uniqueIds.size !== bookSeries.length) {
  throw new Error("Duplicate book-series IDs detected");
}
