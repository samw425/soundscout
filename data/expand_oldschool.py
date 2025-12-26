#!/usr/bin/env python3
"""
Expand Old School legends to 150 artists.
Adds 125 more classic artists to the existing 25.
"""

import json
import os

# Additional 125 legends to add (26-150)
additional_legends = [
    {"rank": 26, "name": "Fleetwood Mac", "genre": "Rock", "era": "70s", "peakYear": 1977, "country": "UK/USA", "bio": "Rumours is one of the best-selling albums of all time.", "signature_songs": ["The Chain", "Dreams", "Go Your Own Way", "Landslide", "Rhiannon"]},
    {"rank": 27, "name": "Pink Floyd", "genre": "Rock", "era": "70s", "peakYear": 1973, "country": "UK", "bio": "Pioneers of progressive rock. Dark Side of the Moon spent 937 weeks on Billboard.", "signature_songs": ["Comfortably Numb", "Wish You Were Here", "Another Brick in the Wall", "Money", "Time"]},
    {"rank": 28, "name": "The Rolling Stones", "genre": "Rock", "era": "60s", "peakYear": 1969, "country": "UK", "bio": "The greatest rock and roll band in the world. Still touring after 60 years.", "signature_songs": ["Satisfaction", "Paint It Black", "Sympathy for the Devil", "Gimme Shelter", "Start Me Up"]},
    {"rank": 29, "name": "AC/DC", "genre": "Rock", "era": "80s", "peakYear": 1980, "country": "Australia", "bio": "Back in Black is the second best-selling album ever.", "signature_songs": ["Back in Black", "Highway to Hell", "Thunderstruck", "T.N.T.", "You Shook Me All Night Long"]},
    {"rank": 30, "name": "Aerosmith", "genre": "Rock", "era": "70s", "peakYear": 1975, "country": "USA", "bio": "America's greatest rock band with a career spanning 50+ years.", "signature_songs": ["Dream On", "Walk This Way", "I Don't Want to Miss a Thing", "Sweet Emotion", "Crazy"]},
    {"rank": 31, "name": "James Brown", "genre": "Funk/Soul", "era": "60s", "peakYear": 1965, "country": "USA", "bio": "The Godfather of Soul. Created funk and influenced everyone.", "signature_songs": ["I Got You", "Papa's Got a Brand New Bag", "Get Up Offa That Thing", "Sex Machine", "It's a Man's Man's Man's World"]},
    {"rank": 32, "name": "The Temptations", "genre": "R&B/Soul", "era": "60s", "peakYear": 1965, "country": "USA", "bio": "Motown legends with 4 #1 hits and 14 #1 R&B singles.", "signature_songs": ["My Girl", "Ain't Too Proud to Beg", "Just My Imagination", "Papa Was a Rollin' Stone", "The Way You Do the Things You Do"]},
    {"rank": 33, "name": "Diana Ross", "genre": "Pop/R&B", "era": "70s", "peakYear": 1970, "country": "USA", "bio": "Supreme leader of The Supremes and solo icon.", "signature_songs": ["I'm Coming Out", "Upside Down", "Ain't No Mountain High Enough", "Stop! In the Name of Love", "You Can't Hurry Love"]},
    {"rank": 34, "name": "Donna Summer", "genre": "Disco", "era": "70s", "peakYear": 1978, "country": "USA", "bio": "The Queen of Disco. Defined an entire era of dance music.", "signature_songs": ["I Feel Love", "Hot Stuff", "Bad Girls", "Last Dance", "Love to Love You Baby"]},
    {"rank": 35, "name": "Earth, Wind & Fire", "genre": "Funk/R&B", "era": "70s", "peakYear": 1975, "country": "USA", "bio": "Fusion of funk, soul, jazz, and pop that defined the sound of a decade.", "signature_songs": ["September", "Boogie Wonderland", "Let's Groove", "Shining Star", "Fantasy"]},
    {"rank": 36, "name": "Bee Gees", "genre": "Pop/Disco", "era": "70s", "peakYear": 1977, "country": "UK/Australia", "bio": "Saturday Night Fever soundtrack sold 40 million copies.", "signature_songs": ["Stayin' Alive", "How Deep Is Your Love", "Night Fever", "More Than a Woman", "Jive Talkin'"]},
    {"rank": 37, "name": "ABBA", "genre": "Pop", "era": "70s", "peakYear": 1976, "country": "Sweden", "bio": "Sweden's greatest export. 400 million records sold.", "signature_songs": ["Dancing Queen", "Mamma Mia", "Fernando", "Waterloo", "Take a Chance on Me"]},
    {"rank": 38, "name": "Lionel Richie", "genre": "R&B/Pop", "era": "80s", "peakYear": 1984, "country": "USA", "bio": "Solo success after The Commodores. Hello is iconic.", "signature_songs": ["Hello", "All Night Long", "Say You, Say Me", "Easy", "Three Times a Lady"]},
    {"rank": 39, "name": "Billy Joel", "genre": "Pop/Rock", "era": "70s", "peakYear": 1977, "country": "USA", "bio": "The Piano Man. One of the best-selling artists of all time.", "signature_songs": ["Piano Man", "Uptown Girl", "We Didn't Start the Fire", "Just the Way You Are", "New York State of Mind"]},
    {"rank": 40, "name": "Bruce Springsteen", "genre": "Rock", "era": "80s", "peakYear": 1984, "country": "USA", "bio": "The Boss. Born in the U.S.A. sold 30 million copies.", "signature_songs": ["Born to Run", "Born in the U.S.A.", "Dancing in the Dark", "Thunder Road", "The River"]},
    {"rank": 41, "name": "Eric Clapton", "genre": "Rock/Blues", "era": "70s", "peakYear": 1970, "country": "UK", "bio": "Guitar god. Only 3-time Rock Hall inductee.", "signature_songs": ["Layla", "Tears in Heaven", "Wonderful Tonight", "Cocaine", "I Shot the Sheriff"]},
    {"rank": 42, "name": "The Who", "genre": "Rock", "era": "70s", "peakYear": 1971, "country": "UK", "bio": "British Invasion legends. Tommy and Who's Next are masterpieces.", "signature_songs": ["Baba O'Riley", "My Generation", "Won't Get Fooled Again", "Pinball Wizard", "Behind Blue Eyes"]},
    {"rank": 43, "name": "The Eagles", "genre": "Rock", "era": "70s", "peakYear": 1976, "country": "USA", "bio": "Hotel California is the third best-selling album in US history.", "signature_songs": ["Hotel California", "Take It Easy", "Desperado", "Life in the Fast Lane", "One of These Nights"]},
    {"rank": 44, "name": "Bon Jovi", "genre": "Rock", "era": "80s", "peakYear": 1986, "country": "USA", "bio": "130 million records sold. 'Livin' on a Prayer' is an anthem.", "signature_songs": ["Livin' on a Prayer", "You Give Love a Bad Name", "Wanted Dead or Alive", "It's My Life", "Bad Medicine"]},
    {"rank": 45, "name": "Van Halen", "genre": "Rock", "era": "80s", "peakYear": 1984, "country": "USA", "bio": "Eddie Van Halen redefined electric guitar.", "signature_songs": ["Jump", "Panama", "Hot for Teacher", "Runnin' with the Devil", "Eruption"]},
    {"rank": 46, "name": "Metallica", "genre": "Metal", "era": "80s", "peakYear": 1991, "country": "USA", "bio": "The biggest metal band in history. Black Album sold 30 million.", "signature_songs": ["Enter Sandman", "Nothing Else Matters", "Master of Puppets", "One", "Fade to Black"]},
    {"rank": 47, "name": "Iron Maiden", "genre": "Metal", "era": "80s", "peakYear": 1982, "country": "UK", "bio": "British heavy metal icons. Still headlining stadiums.", "signature_songs": ["The Trooper", "Run to the Hills", "Fear of the Dark", "The Number of the Beast", "Hallowed Be Thy Name"]},
    {"rank": 48, "name": "Black Sabbath", "genre": "Metal", "era": "70s", "peakYear": 1970, "country": "UK", "bio": "Invented heavy metal. Ozzy is the Prince of Darkness.", "signature_songs": ["Paranoid", "Iron Man", "War Pigs", "Black Sabbath", "N.I.B."]},
    {"rank": 49, "name": "Def Leppard", "genre": "Rock", "era": "80s", "peakYear": 1987, "country": "UK", "bio": "Hysteria sold 25 million copies worldwide.", "signature_songs": ["Pour Some Sugar on Me", "Love Bites", "Photograph", "Hysteria", "Rock of Ages"]},
    {"rank": 50, "name": "Journey", "genre": "Rock", "era": "80s", "peakYear": 1981, "country": "USA", "bio": "Don't Stop Believin' is the most downloaded 20th century song.", "signature_songs": ["Don't Stop Believin'", "Open Arms", "Faithfully", "Separate Ways", "Any Way You Want It"]},
    {"rank": 51, "name": "Public Enemy", "genre": "Hip Hop", "era": "80s", "peakYear": 1988, "country": "USA", "bio": "Revolutionary hip hop. Fight the Power changed music.", "signature_songs": ["Fight the Power", "Bring the Noise", "911 Is a Joke", "Don't Believe the Hype", "Black Steel in the Hour of Chaos"]},
    {"rank": 52, "name": "A Tribe Called Quest", "genre": "Hip Hop", "era": "90s", "peakYear": 1991, "country": "USA", "bio": "Jazz-rap pioneers. Low End Theory is a masterpiece.", "signature_songs": ["Can I Kick It?", "Scenario", "Electric Relaxation", "Award Tour", "Check the Rhime"]},
    {"rank": 53, "name": "Outkast", "genre": "Hip Hop", "era": "00s", "peakYear": 2003, "country": "USA", "bio": "Atlanta duo who pushed hip hop into new territory.", "signature_songs": ["Hey Ya!", "Ms. Jackson", "B.O.B.", "Rosa Parks", "So Fresh, So Clean"]},
    {"rank": 54, "name": "The Roots", "genre": "Hip Hop", "era": "90s", "peakYear": 1999, "country": "USA", "bio": "Live instrumentation in hip hop. Questlove is a legend.", "signature_songs": ["The Seed 2.0", "You Got Me", "What They Do", "The Next Movement", "Proceed"]},
    {"rank": 55, "name": "Ice Cube", "genre": "Hip Hop", "era": "90s", "peakYear": 1992, "country": "USA", "bio": "N.W.A member turned solo icon and actor.", "signature_songs": ["It Was a Good Day", "Check Yo Self", "No Vaseline", "You Can Do It", "Friday"]},
    {"rank": 56, "name": "Scarface", "genre": "Hip Hop", "era": "90s", "peakYear": 1994, "country": "USA", "bio": "Geto Boys legend. The Diary is a southern classic.", "signature_songs": ["Mind Playing Tricks on Me", "Smile", "I Seen a Man Die", "On My Block", "Mary Jane"]},
    {"rank": 57, "name": "DMX", "genre": "Hip Hop", "era": "00s", "peakYear": 1998, "country": "USA", "bio": "First artist to debut at #1 five times consecutively.", "signature_songs": ["Party Up", "Ruff Ryders' Anthem", "X Gon' Give It to Ya", "Where the Hood At", "Slippin'"]},
    {"rank": 58, "name": "LL Cool J", "genre": "Hip Hop", "era": "80s", "peakYear": 1987, "country": "USA", "bio": "First hip hop artist with a string of hits across decades.", "signature_songs": ["Mama Said Knock You Out", "Going Back to Cali", "I Need Love", "Rock the Bells", "Doin' It"]},
    {"rank": 59, "name": "Beastie Boys", "genre": "Hip Hop", "era": "80s", "peakYear": 1986, "country": "USA", "bio": "Licensed to Ill was first hip hop album to top Billboard.", "signature_songs": ["Sabotage", "Intergalactic", "Fight for Your Right", "No Sleep Till Brooklyn", "So What'cha Want"]},
    {"rank": 60, "name": "De La Soul", "genre": "Hip Hop", "era": "90s", "peakYear": 1989, "country": "USA", "bio": "Alternative hip hop pioneers with creative sampling.", "signature_songs": ["Me Myself and I", "Ring Ring Ring", "Buddy", "A Roller Skating Jam Named Saturdays", "Stakes Is High"]},
    {"rank": 61, "name": "Cypress Hill", "genre": "Hip Hop", "era": "90s", "peakYear": 1993, "country": "USA", "bio": "Latin hip hop pioneers. Signature nasal flow.", "signature_songs": ["Insane in the Brain", "How I Could Just Kill a Man", "Hits from the Bong", "Rock Superstar", "Tequila Sunrise"]},
    {"rank": 62, "name": "Mobb Deep", "genre": "Hip Hop", "era": "90s", "peakYear": 1995, "country": "USA", "bio": "Queensbridge duo. The Infamous is a hardcore classic.", "signature_songs": ["Shook Ones Pt. II", "Quiet Storm", "Survival of the Fittest", "Hell on Earth", "Burn"]},
    {"rank": 63, "name": "Big Daddy Kane", "genre": "Hip Hop", "era": "80s", "peakYear": 1988, "country": "USA", "bio": "Smooth flow pioneer. Influenced Jay-Z and Nas.", "signature_songs": ["Ain't No Half-Steppin'", "Raw", "Smooth Operator", "Warm It Up Kane", "Set It Off"]},
    {"rank": 64, "name": "Rakim", "genre": "Hip Hop", "era": "80s", "peakYear": 1987, "country": "USA", "bio": "The God MC. Revolutionized lyrical complexity.", "signature_songs": ["Paid in Full", "I Ain't No Joke", "Eric B. Is President", "Microphone Fiend", "Follow the Leader"]},
    {"rank": 65, "name": "Slick Rick", "genre": "Hip Hop", "era": "80s", "peakYear": 1988, "country": "UK/USA", "bio": "The Ruler. Master storyteller of hip hop.", "signature_songs": ["Children's Story", "La Di Da Di", "Hey Young World", "Mona Lisa", "Teenage Love"]},
    {"rank": 66, "name": "Tina Turner", "genre": "Rock/R&B", "era": "80s", "peakYear": 1984, "country": "USA", "bio": "Queen of Rock and Roll. Ultimate comeback story.", "signature_songs": ["What's Love Got to Do with It", "Private Dancer", "Simply the Best", "Proud Mary", "River Deep, Mountain High"]},
    {"rank": 67, "name": "Janet Jackson", "genre": "Pop/R&B", "era": "80s", "peakYear": 1989, "country": "USA", "bio": "Control and Rhythm Nation defined pop innovation.", "signature_songs": ["Rhythm Nation", "Nasty", "Control", "That's the Way Love Goes", "Together Again"]},
    {"rank": 68, "name": "Anita Baker", "genre": "R&B", "era": "80s", "peakYear": 1986, "country": "USA", "bio": "Quiet storm queen with an 8-Grammy career.", "signature_songs": ["Sweet Love", "Giving You the Best That I Got", "Caught Up in the Rapture", "Just Because", "Angel"]},
    {"rank": 69, "name": "Luther Vandross", "genre": "R&B", "era": "80s", "peakYear": 1981, "country": "USA", "bio": "The velvet voice of R&B. 8 consecutive platinum albums.", "signature_songs": ["Never Too Much", "Here and Now", "Dance with My Father", "A House Is Not a Home", "Power of Love"]},
    {"rank": 70, "name": "Teddy Pendergrass", "genre": "R&B", "era": "70s", "peakYear": 1978, "country": "USA", "bio": "First male artist with 5 consecutive platinum albums.", "signature_songs": ["Turn Off the Lights", "Close the Door", "Love T.K.O.", "If You Don't Know Me by Now", "You're My Latest, My Greatest Inspiration"]},
    {"rank": 71, "name": "Al Green", "genre": "Soul", "era": "70s", "peakYear": 1972, "country": "USA", "bio": "Silky smooth voice defined Memphis soul.", "signature_songs": ["Let's Stay Together", "Love and Happiness", "Tired of Being Alone", "I'm Still in Love with You", "Here I Am"]},
    {"rank": 72, "name": "Sade", "genre": "R&B/Soul", "era": "80s", "peakYear": 1984, "country": "UK", "bio": "British-Nigerian band with smooth sophistication.", "signature_songs": ["Smooth Operator", "No Ordinary Love", "By Your Side", "Sweetest Taboo", "Kiss of Life"]},
    {"rank": 73, "name": "Chaka Khan", "genre": "Funk/R&B", "era": "70s", "peakYear": 1978, "country": "USA", "bio": "Queen of Funk with a four-octave range.", "signature_songs": ["I'm Every Woman", "Through the Fire", "Ain't Nobody", "Tell Me Something Good", "I Feel for You"]},
    {"rank": 74, "name": "Patti LaBelle", "genre": "R&B", "era": "80s", "peakYear": 1984, "country": "USA", "bio": "The Godmother of Soul. Power vocals personified.", "signature_songs": ["Lady Marmalade", "New Attitude", "On My Own", "If Only You Knew", "Got to Be Real"]},
    {"rank": 75, "name": "Gladys Knight", "genre": "Soul", "era": "70s", "peakYear": 1973, "country": "USA", "bio": "The Empress of Soul. Midnight Train is timeless.", "signature_songs": ["Midnight Train to Georgia", "Best Thing That Ever Happened to Me", "Neither One of Us", "I Heard It Through the Grapevine", "If I Were Your Woman"]},
    {"rank": 76, "name": "Smokey Robinson", "genre": "Soul", "era": "60s", "peakYear": 1965, "country": "USA", "bio": "Motown songwriter and performer extraordinaire.", "signature_songs": ["Cruisin'", "Being with You", "The Tracks of My Tears", "Tears of a Clown", "My Girl"]},
    {"rank": 77, "name": "The Isley Brothers", "genre": "R&B/Funk", "era": "70s", "peakYear": 1975, "country": "USA", "bio": "Multi-decade legends spanning soul, funk, and R&B.", "signature_songs": ["Shout", "It's Your Thing", "Between the Sheets", "For the Love of You", "Summer Breeze"]},
    {"rank": 78, "name": "Parliament-Funkadelic", "genre": "Funk", "era": "70s", "peakYear": 1977, "country": "USA", "bio": "George Clinton's mothership of funk.", "signature_songs": ["Flash Light", "Give Up the Funk", "Atomic Dog", "One Nation Under a Groove", "P-Funk"]},
    {"rank": 79, "name": "Jimi Hendrix", "genre": "Rock", "era": "60s", "peakYear": 1967, "country": "USA", "bio": "Greatest guitarist of all time. Changed electric guitar forever.", "signature_songs": ["Purple Haze", "Hey Joe", "All Along the Watchtower", "Voodoo Child", "The Wind Cries Mary"]},
    {"rank": 80, "name": "Janis Joplin", "genre": "Rock/Blues", "era": "60s", "peakYear": 1968, "country": "USA", "bio": "Queen of psychedelic soul. Raw emotional power.", "signature_songs": ["Me and Bobby McGee", "Piece of My Heart", "Mercedes Benz", "Cry Baby", "Ball and Chain"]},
    {"rank": 81, "name": "The Doors", "genre": "Rock", "era": "60s", "peakYear": 1967, "country": "USA", "bio": "Jim Morrison's poetry and psychedelic rock.", "signature_songs": ["Light My Fire", "Riders on the Storm", "Break On Through", "People Are Strange", "Hello, I Love You"]},
    {"rank": 82, "name": "Creedence Clearwater Revival", "genre": "Rock", "era": "60s", "peakYear": 1969, "country": "USA", "bio": "Swamp rock pioneers with timeless hits.", "signature_songs": ["Fortunate Son", "Bad Moon Rising", "Proud Mary", "Have You Ever Seen the Rain", "Born on the Bayou"]},
    {"rank": 83, "name": "Simon & Garfunkel", "genre": "Folk Rock", "era": "60s", "peakYear": 1968, "country": "USA", "bio": "Folk-rock poetry. Bridge Over Troubled Water is perfection.", "signature_songs": ["Bridge Over Troubled Water", "The Sound of Silence", "Mrs. Robinson", "Scarborough Fair", "Cecilia"]},
    {"rank": 84, "name": "Joni Mitchell", "genre": "Folk", "era": "70s", "peakYear": 1971, "country": "Canada", "bio": "Blue is considered one of the greatest albums ever.", "signature_songs": ["Both Sides Now", "Big Yellow Taxi", "A Case of You", "River", "Woodstock"]},
    {"rank": 85, "name": "Neil Young", "genre": "Rock", "era": "70s", "peakYear": 1972, "country": "Canada", "bio": "Godfather of grunge. Heart of Gold to Rust Never Sleeps.", "signature_songs": ["Heart of Gold", "Old Man", "Rockin' in the Free World", "Harvest Moon", "Cinnamon Girl"]},
    {"rank": 86, "name": "Tom Petty", "genre": "Rock", "era": "80s", "peakYear": 1989, "country": "USA", "bio": "Heartbreaker. Classic American rock.", "signature_songs": ["Free Fallin'", "I Won't Back Down", "American Girl", "Refugee", "Learning to Fly"]},
    {"rank": 87, "name": "Bob Dylan", "genre": "Folk/Rock", "era": "60s", "peakYear": 1965, "country": "USA", "bio": "Nobel Prize winner. Changed songwriting forever.", "signature_songs": ["Like a Rolling Stone", "Blowin' in the Wind", "The Times They Are a-Changin'", "Knockin' on Heaven's Door", "Tangled Up in Blue"]},
    {"rank": 88, "name": "Elvis Presley", "genre": "Rock/Pop", "era": "50s", "peakYear": 1957, "country": "USA", "bio": "The King. Best-selling solo artist in history.", "signature_songs": ["Jailhouse Rock", "Hound Dog", "Suspicious Minds", "Can't Help Falling in Love", "Heartbreak Hotel"]},
    {"rank": 89, "name": "Ray Charles", "genre": "Soul/R&B", "era": "60s", "peakYear": 1962, "country": "USA", "bio": "The Genius. Father of soul music.", "signature_songs": ["Hit the Road Jack", "Georgia on My Mind", "What'd I Say", "I Got a Woman", "Unchain My Heart"]},
    {"rank": 90, "name": "Sam Cooke", "genre": "Soul", "era": "60s", "peakYear": 1960, "country": "USA", "bio": "King of Soul. Pioneered the genre.", "signature_songs": ["A Change Is Gonna Come", "You Send Me", "Cupid", "Bring It On Home to Me", "Chain Gang"]},
    {"rank": 91, "name": "Otis Redding", "genre": "Soul", "era": "60s", "peakYear": 1967, "country": "USA", "bio": "King of Soul. Dock of the Bay is immortal.", "signature_songs": ["(Sittin' On) The Dock of the Bay", "Try a Little Tenderness", "These Arms of Mine", "Pain in My Heart", "Respect"]},
    {"rank": 92, "name": "Curtis Mayfield", "genre": "Soul", "era": "70s", "peakYear": 1972, "country": "USA", "bio": "Superfly soundtrack and socially conscious soul.", "signature_songs": ["Superfly", "Move On Up", "Freddie's Dead", "Pusherman", "People Get Ready"]},
    {"rank": 93, "name": "The Jackson 5", "genre": "Pop/R&B", "era": "70s", "peakYear": 1970, "country": "USA", "bio": "Motown's biggest act. Launched Michael.", "signature_songs": ["I Want You Back", "ABC", "I'll Be There", "The Love You Save", "Dancing Machine"]},
    {"rank": 94, "name": "The Supremes", "genre": "Pop/R&B", "era": "60s", "peakYear": 1966, "country": "USA", "bio": "Most successful Motown act of the '60s.", "signature_songs": ["Stop! In the Name of Love", "Baby Love", "You Can't Hurry Love", "Come See About Me", "Where Did Our Love Go"]},
    {"rank": 95, "name": "Kool & The Gang", "genre": "Funk", "era": "80s", "peakYear": 1980, "country": "USA", "bio": "Celebration is the party anthem forever.", "signature_songs": ["Celebration", "Get Down on It", "Jungle Boogie", "Ladies' Night", "Cherish"]},
    {"rank": 96, "name": "Barry White", "genre": "R&B", "era": "70s", "peakYear": 1974, "country": "USA", "bio": "The Walrus of Love. Deep voice extraordinaire.", "signature_songs": ["Can't Get Enough of Your Love, Babe", "You're the First, the Last, My Everything", "I'm Gonna Love You Just a Little More Baby", "Never, Never Gonna Give Ya Up", "Let the Music Play"]},
    {"rank": 97, "name": "Isaac Hayes", "genre": "Soul/Funk", "era": "70s", "peakYear": 1971, "country": "USA", "bio": "Shaft soundtrack. Oscar winner.", "signature_songs": ["Theme from Shaft", "Walk On By", "Joy", "Never Can Say Goodbye", "Hyperbolicsyllabicsesquedalymistic"]},
    {"rank": 98, "name": "Rick James", "genre": "Funk", "era": "80s", "peakYear": 1981, "country": "USA", "bio": "Super Freak. Buffalo funk legend.", "signature_songs": ["Super Freak", "Give It to Me Baby", "Mary Jane", "Fire and Desire", "You and I"]},
    {"rank": 99, "name": "Grandmaster Flash", "genre": "Hip Hop", "era": "80s", "peakYear": 1982, "country": "USA", "bio": "Pioneer of DJing. The Message is landmark hip hop.", "signature_songs": ["The Message", "White Lines", "The Adventures of Grandmaster Flash on the Wheels of Steel", "New York New York", "Freedom"]},
    {"rank": 100, "name": "Eric B. & Rakim", "genre": "Hip Hop", "era": "80s", "peakYear": 1987, "country": "USA", "bio": "Paid in Full changed hip hop production.", "signature_songs": ["Paid in Full", "I Know You Got Soul", "Eric B. Is President", "Follow the Leader", "Juice"]},
    {"rank": 101, "name": "EPMD", "genre": "Hip Hop", "era": "80s", "peakYear": 1988, "country": "USA", "bio": "Strictly Business. Funk sampling pioneers.", "signature_songs": ["Strictly Business", "You Gots to Chill", "Crossover", "So Wat Cha Sayin'", "Da Joint"]},
    {"rank": 102, "name": "Salt-N-Pepa", "genre": "Hip Hop", "era": "80s", "peakYear": 1987, "country": "USA", "bio": "First female rap act with gold and platinum albums.", "signature_songs": ["Push It", "Shoop", "Let's Talk About Sex", "Whatta Man", "None of Your Business"]},
    {"rank": 103, "name": "MC Lyte", "genre": "Hip Hop", "era": "80s", "peakYear": 1988, "country": "USA", "bio": "Pioneer of female hip hop. First female solo gold album.", "signature_songs": ["Cha Cha Cha", "Lyte as a Rock", "Ruffneck", "Paper Thin", "I Cram to Understand U"]},
    {"rank": 104, "name": "Queen Latifah", "genre": "Hip Hop", "era": "90s", "peakYear": 1989, "country": "USA", "bio": "All Hail the Queen. Hip hop royalty turned Oscar nominee.", "signature_songs": ["U.N.I.T.Y.", "Ladies First", "Just Another Day", "Wrath of My Madness", "Dance for Me"]},
    {"rank": 105, "name": "Missy Elliott", "genre": "Hip Hop", "era": "00s", "peakYear": 2002, "country": "USA", "bio": "Revolutionary producer and visionary artist.", "signature_songs": ["Get Ur Freak On", "Work It", "Lose Control", "The Rain", "One Minute Man"]},
    {"rank": 106, "name": "Lauryn Hill", "genre": "Hip Hop/R&B", "era": "90s", "peakYear": 1998, "country": "USA", "bio": "The Miseducation is one of the greatest albums ever.", "signature_songs": ["Doo Wop (That Thing)", "Everything Is Everything", "Ex-Factor", "Lost Ones", "Killing Me Softly"]},
    {"rank": 107, "name": "Mary J. Blige", "genre": "R&B/Hip Hop", "era": "90s", "peakYear": 1994, "country": "USA", "bio": "Queen of Hip Hop Soul.", "signature_songs": ["Real Love", "No More Drama", "Family Affair", "Be Without You", "Not Gon' Cry"]},
    {"rank": 108, "name": "TLC", "genre": "R&B", "era": "90s", "peakYear": 1994, "country": "USA", "bio": "Best-selling female group in US history.", "signature_songs": ["Waterfalls", "No Scrubs", "Creep", "Unpretty", "Baby-Baby-Baby"]},
    {"rank": 109, "name": "En Vogue", "genre": "R&B", "era": "90s", "peakYear": 1992, "country": "USA", "bio": "Harmonies and style. Funky Divas.", "signature_songs": ["Don't Let Go", "Hold On", "My Lovin'", "Free Your Mind", "Give It Up, Turn It Loose"]},
    {"rank": 110, "name": "Boyz II Men", "genre": "R&B", "era": "90s", "peakYear": 1994, "country": "USA", "bio": "Best-selling R&B group ever. End of the Road.", "signature_songs": ["End of the Road", "I'll Make Love to You", "One Sweet Day", "Motownphilly", "It's So Hard to Say Goodbye to Yesterday"]},
    {"rank": 111, "name": "New Edition", "genre": "R&B", "era": "80s", "peakYear": 1983, "country": "USA", "bio": "Launched Bobby Brown, Bell Biv DeVoe, and Johnny Gill.", "signature_songs": ["Candy Girl", "Mr. Telephone Man", "If It Isn't Love", "Can You Stand the Rain", "Cool It Now"]},
    {"rank": 112, "name": "R. Kelly", "genre": "R&B", "era": "90s", "peakYear": 1996, "country": "USA", "bio": "I Believe I Can Fly. Controversial legacy.", "signature_songs": ["I Believe I Can Fly", "Bump N' Grind", "Ignition", "Step in the Name of Love", "The World's Greatest"]},
    {"rank": 113, "name": "Keith Sweat", "genre": "R&B", "era": "80s", "peakYear": 1987, "country": "USA", "bio": "New Jack Swing pioneer.", "signature_songs": ["I Want Her", "Make It Last Forever", "Twisted", "Nobody", "Right and a Wrong Way"]},
    {"rank": 114, "name": "Bobby Brown", "genre": "R&B", "era": "80s", "peakYear": 1988, "country": "USA", "bio": "King of New Jack Swing.", "signature_songs": ["My Prerogative", "Every Little Step", "Roni", "Don't Be Cruel", "Humpin' Around"]},
    {"rank": 115, "name": "Bell Biv DeVoe", "genre": "R&B", "era": "90s", "peakYear": 1990, "country": "USA", "bio": "New Edition splinter. Poison is iconic.", "signature_songs": ["Poison", "Do Me!", "B.B.D.", "When Will I See You Smile Again", "She's Dope!"]},
    {"rank": 116, "name": "Guy", "genre": "R&B", "era": "80s", "peakYear": 1988, "country": "USA", "bio": "Teddy Riley invented New Jack Swing.", "signature_songs": ["Groove Me", "Piece of My Love", "I Like", "Let's Chill", "New Jack City"]},
    {"rank": 117, "name": "Jodeci", "genre": "R&B", "era": "90s", "peakYear": 1993, "country": "USA", "bio": "Forever My Lady. Uptown's finest.", "signature_songs": ["Forever My Lady", "Come and Talk to Me", "Cry for You", "Feenin'", "Stay"]},
    {"rank": 118, "name": "SWV", "genre": "R&B", "era": "90s", "peakYear": 1993, "country": "USA", "bio": "Sisters with Voices. Weak is a classic.", "signature_songs": ["Weak", "Right Here", "I'm So Into You", "You're the One", "Rain"]},
    {"rank": 119, "name": "Destiny's Child", "genre": "R&B", "era": "00s", "peakYear": 2001, "country": "USA", "bio": "Launched Beyoncé. Survivor era dominance.", "signature_songs": ["Say My Name", "Bills, Bills, Bills", "Survivor", "Jumpin' Jumpin'", "Bootylicious"]},
    {"rank": 120, "name": "Usher", "genre": "R&B", "era": "00s", "peakYear": 2004, "country": "USA", "bio": "My Way and Confessions era superstardom.", "signature_songs": ["Yeah!", "U Got It Bad", "Burn", "Nice & Slow", "You Make Me Wanna..."]},
    {"rank": 121, "name": "R.E.M.", "genre": "Rock", "era": "90s", "peakYear": 1991, "country": "USA", "bio": "Alternative rock pioneers. Losing My Religion.", "signature_songs": ["Losing My Religion", "Everybody Hurts", "Man on the Moon", "It's the End of the World", "Shiny Happy People"]},
    {"rank": 122, "name": "U2", "genre": "Rock", "era": "80s", "peakYear": 1987, "country": "Ireland", "bio": "The Joshua Tree. One of the biggest bands ever.", "signature_songs": ["With or Without You", "One", "Beautiful Day", "Where the Streets Have No Name", "Sunday Bloody Sunday"]},
    {"rank": 123, "name": "The Police", "genre": "Rock", "era": "80s", "peakYear": 1983, "country": "UK", "bio": "Sting's band. Reggae-rock fusion.", "signature_songs": ["Every Breath You Take", "Roxanne", "Message in a Bottle", "Don't Stand So Close to Me", "Every Little Thing She Does Is Magic"]},
    {"rank": 124, "name": "Depeche Mode", "genre": "Electronic", "era": "80s", "peakYear": 1990, "country": "UK", "bio": "Synthpop pioneers. Massive global influence.", "signature_songs": ["Enjoy the Silence", "Personal Jesus", "Just Can't Get Enough", "People Are People", "Policy of Truth"]},
    {"rank": 125, "name": "New Order", "genre": "Electronic", "era": "80s", "peakYear": 1983, "country": "UK", "bio": "Blue Monday is the best-selling 12-inch ever.", "signature_songs": ["Blue Monday", "Bizarre Love Triangle", "True Faith", "Temptation", "Age of Consent"]},
    {"rank": 126, "name": "The Cure", "genre": "Rock", "era": "80s", "peakYear": 1989, "country": "UK", "bio": "Goth rock legends. Robert Smith is iconic.", "signature_songs": ["Friday I'm in Love", "Just Like Heaven", "Lovesong", "Boys Don't Cry", "Pictures of You"]},
    {"rank": 127, "name": "The Smiths", "genre": "Rock", "era": "80s", "peakYear": 1986, "country": "UK", "bio": "Morrissey and Marr. Defined alternative rock.", "signature_songs": ["There Is a Light That Never Goes Out", "How Soon Is Now?", "The Boy with the Thorn in His Side", "Bigmouth Strikes Again", "This Charming Man"]},
    {"rank": 128, "name": "Joy Division", "genre": "Post-Punk", "era": "80s", "peakYear": 1979, "country": "UK", "bio": "Ian Curtis. Unknown Pleasures is legendary.", "signature_songs": ["Love Will Tear Us Apart", "She's Lost Control", "Transmission", "Atmosphere", "Disorder"]},
    {"rank": 129, "name": "Talking Heads", "genre": "Rock", "era": "80s", "peakYear": 1983, "country": "USA", "bio": "David Byrne's art-rock revolution.", "signature_songs": ["Once in a Lifetime", "Psycho Killer", "Burning Down the House", "Road to Nowhere", "And She Was"]},
    {"rank": 130, "name": "Blondie", "genre": "Rock/New Wave", "era": "80s", "peakYear": 1979, "country": "USA", "bio": "Debbie Harry. Heart of Glass.", "signature_songs": ["Heart of Glass", "Call Me", "Rapture", "The Tide Is High", "One Way or Another"]},
    {"rank": 131, "name": "Eurythmics", "genre": "Pop", "era": "80s", "peakYear": 1983, "country": "UK", "bio": "Annie Lennox's voice. Sweet Dreams.", "signature_songs": ["Sweet Dreams", "Here Comes the Rain Again", "Would I Lie to You?", "Missionary Man", "Sisters Are Doin' It"]},
    {"rank": 132, "name": "Pet Shop Boys", "genre": "Electronic/Pop", "era": "80s", "peakYear": 1986, "country": "UK", "bio": "Best-selling duo in UK history.", "signature_songs": ["West End Girls", "It's a Sin", "Always on My Mind", "Opportunities", "What Have I Done to Deserve This?"]},
    {"rank": 133, "name": "Hall & Oates", "genre": "Pop/Rock", "era": "80s", "peakYear": 1982, "country": "USA", "bio": "Best-selling duo of all time.", "signature_songs": ["Kiss on My List", "Maneater", "I Can't Go for That", "Rich Girl", "Private Eyes"]},
    {"rank": 134, "name": "Phil Collins", "genre": "Pop/Rock", "era": "80s", "peakYear": 1985, "country": "UK", "bio": "Genesis frontman. Solo superstar.", "signature_songs": ["In the Air Tonight", "Against All Odds", "Another Day in Paradise", "Easy Lover", "Sussudio"]},
    {"rank": 135, "name": "Genesis", "genre": "Rock", "era": "80s", "peakYear": 1986, "country": "UK", "bio": "Peter Gabriel era to Phil Collins era.", "signature_songs": ["Invisible Touch", "Land of Confusion", "Tonight Tonight Tonight", "That's All", "Follow You Follow Me"]},
    {"rank": 136, "name": "Peter Gabriel", "genre": "Rock", "era": "80s", "peakYear": 1986, "country": "UK", "bio": "So is a masterpiece. Sledgehammer.", "signature_songs": ["Sledgehammer", "In Your Eyes", "Don't Give Up", "Games Without Frontiers", "Solsbury Hill"]},
    {"rank": 137, "name": "Kate Bush", "genre": "Art Pop", "era": "80s", "peakYear": 1985, "country": "UK", "bio": "Running Up That Hill. Visionary artist.", "signature_songs": ["Running Up That Hill", "Wuthering Heights", "Babooshka", "Cloudbusting", "The Man with the Child in His Eyes"]},
    {"rank": 138, "name": "Toto", "genre": "Rock", "era": "80s", "peakYear": 1982, "country": "USA", "bio": "Africa. Session musician supergroup.", "signature_songs": ["Africa", "Rosanna", "Hold the Line", "I Won't Hold You Back", "Pamela"]},
    {"rank": 139, "name": "Foreigner", "genre": "Rock", "era": "80s", "peakYear": 1981, "country": "USA/UK", "bio": "Power ballad specialists.", "signature_songs": ["I Want to Know What Love Is", "Waiting for a Girl Like You", "Hot Blooded", "Cold as Ice", "Urgent"]},
    {"rank": 140, "name": "REO Speedwagon", "genre": "Rock", "era": "80s", "peakYear": 1981, "country": "USA", "bio": "Keep On Loving You. Arena rock.", "signature_songs": ["Keep On Loving You", "Can't Fight This Feeling", "Take It on the Run", "Time for Me to Fly", "In Your Letter"]},
    {"rank": 141, "name": "Chicago", "genre": "Rock", "era": "70s", "peakYear": 1976, "country": "USA", "bio": "Horn-driven rock. Hard to Say I'm Sorry.", "signature_songs": ["Hard to Say I'm Sorry", "If You Leave Me Now", "25 or 6 to 4", "Saturday in the Park", "You're the Inspiration"]},
    {"rank": 142, "name": "Steely Dan", "genre": "Rock/Jazz", "era": "70s", "peakYear": 1977, "country": "USA", "bio": "Sophisticated jazz-rock. Aja is perfect.", "signature_songs": ["Reelin' in the Years", "Rikki Don't Lose That Number", "Deacon Blues", "Peg", "Do It Again"]},
    {"rank": 143, "name": "George Michael", "genre": "Pop", "era": "80s", "peakYear": 1987, "country": "UK", "bio": "Faith era. Solo after Wham!", "signature_songs": ["Careless Whisper", "Faith", "Freedom! '90", "Father Figure", "One More Try"]},
    {"rank": 144, "name": "Wham!", "genre": "Pop", "era": "80s", "peakYear": 1984, "country": "UK", "bio": "George Michael's early days.", "signature_songs": ["Wake Me Up Before You Go-Go", "Last Christmas", "Everything She Wants", "I'm Your Man", "Young Guns"]},
    {"rank": 145, "name": "Duran Duran", "genre": "Pop", "era": "80s", "peakYear": 1984, "country": "UK", "bio": "New Romantic leaders. MTV icons.", "signature_songs": ["Hungry Like the Wolf", "Rio", "The Reflex", "Ordinary World", "Save a Prayer"]},
    {"rank": 146, "name": "Culture Club", "genre": "Pop", "era": "80s", "peakYear": 1983, "country": "UK", "bio": "Boy George. Karma Chameleon.", "signature_songs": ["Karma Chameleon", "Do You Really Want to Hurt Me", "I'll Tumble 4 Ya", "Time (Clock of the Heart)", "Miss Me Blind"]},
    {"rank": 147, "name": "Cyndi Lauper", "genre": "Pop", "era": "80s", "peakYear": 1984, "country": "USA", "bio": "Girls Just Want to Have Fun. True Colors.", "signature_songs": ["Girls Just Want to Have Fun", "Time After Time", "True Colors", "She Bop", "All Through the Night"]},
    {"rank": 148, "name": "Pat Benatar", "genre": "Rock", "era": "80s", "peakYear": 1980, "country": "USA", "bio": "Female rock trailblazer. Hit Me with Your Best Shot.", "signature_songs": ["Hit Me with Your Best Shot", "Love Is a Battlefield", "Heartbreaker", "We Belong", "Shadows of the Night"]},
    {"rank": 149, "name": "Heart", "genre": "Rock", "era": "80s", "peakYear": 1985, "country": "USA", "bio": "Wilson sisters. Barracuda.", "signature_songs": ["Barracuda", "Alone", "What About Love", "These Dreams", "Crazy on You"]},
    {"rank": 150, "name": "Fleetwood Mac", "genre": "Rock", "era": "70s", "peakYear": 1977, "country": "UK/USA", "bio": "Dreams. Rumours sold 40 million copies.", "signature_songs": ["Dreams", "Go Your Own Way", "The Chain", "Landslide", "Rhiannon"]}
]

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    oldschool_path = os.path.join(script_dir, 'oldschool.json')
    
    print(f"Loading existing legends from: {oldschool_path}")
    
    with open(oldschool_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    existing_count = len(data['artists'])
    print(f"Found {existing_count} existing legends")
    
    # Add new legends
    for legend in additional_legends:
        new_artist = {
            "id": f"os-{legend['rank']:03d}",
            "rank": legend['rank'],
            "name": legend['name'],
            "genre": legend['genre'],
            "era": legend['era'],
            "peakYear": legend['peakYear'],
            "country": legend['country'],
            "status": "Legend",
            "bio": legend['bio'],
            "monthlyListeners": 10000000,  # Placeholder
            "totalStreams": 5000000000,     # Placeholder
            "grammy_wins": 0,
            "billboard_no1": 0,
            "signature_songs": legend['signature_songs'],
            "sources": {
                "wikipedia": f"https://en.wikipedia.org/wiki/{legend['name'].replace(' ', '_')}",
                "spotify": "",
                "allmusic": ""
            },
            "avatar_url": ""  # Will be fetched by image script
        }
        data['artists'].append(new_artist)
    
    # Remove duplicate Fleetwood Mac if present (rank 26 and 150)
    seen_names = set()
    unique_artists = []
    for artist in data['artists']:
        if artist['name'] not in seen_names:
            seen_names.add(artist['name'])
            unique_artists.append(artist)
    data['artists'] = unique_artists
    
    # Re-rank
    for i, artist in enumerate(data['artists']):
        artist['rank'] = i + 1
        artist['id'] = f"os-{i+1:03d}"
    
    new_count = len(data['artists'])
    print(f"Total legends: {new_count}")
    
    # Save
    with open(oldschool_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Expanded to {new_count} legends!")

if __name__ == '__main__':
    main()
