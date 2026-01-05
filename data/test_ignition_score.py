
import unittest
from generate_rankings import StelarAlgorithm

class TestIgnitionScore(unittest.TestCase):
    def test_viral_hit(self):
        # Viral Rank #1, Trending, High Velocity, Independent, Micro Listener
        score = StelarAlgorithm.calculate_ignition_score(
            viral_rank=1,
            yt_trending=True,
            growth_velocity=120,
            is_independent=True,
            monthly_listeners=50000
        )
        # Expected:
        # Viral: (51-1)*0.6 = 30
        # Heat: 25
        # Velocity: 25 (>100)
        # Discovery: 10 (Indie) + 10 (Micro) = 20
        # Total: 100
        self.assertEqual(score, 100.0)

    def test_mid_tier_rising(self):
        # Viral #25, No Trending, Decent Velocity, Indie, Indie Tier
        score = StelarAlgorithm.calculate_ignition_score(
            viral_rank=25,
            yt_trending=False,
            growth_velocity=30,
            is_independent=True,
            monthly_listeners=250000
        )
        # Expected:
        # Viral: (51-25)*0.6 = 15.6
        # Heat: 0
        # Velocity: 15 (>=20)
        # Discovery: 10 (Indie) + 7 (Indie Tier) = 17
        # Total: 47.6
        self.assertEqual(score, 47.6)

    def test_major_flop(self):
        # No Viral, No Trending, Low Velocity, Major, Big Artist
        score = StelarAlgorithm.calculate_ignition_score(
            viral_rank=0,
            yt_trending=False,
            growth_velocity=2,
            is_independent=False,
            monthly_listeners=5000000
        )
        # Expected:
        # Viral: 0
        # Heat: 0
        # Velocity: 1 (2 * 0.5)
        # Discovery: 0
        # Total: 1.0
        self.assertEqual(score, 1.0)
        
    def test_viral_rank_zero(self):
        # Ensure rank 0 gives 0 points
        score = StelarAlgorithm.calculate_ignition_score(
            viral_rank=0,
            yt_trending=False,
            growth_velocity=0,
            is_independent=False,
            monthly_listeners=1000000
        )
        self.assertEqual(score, 0.0)

if __name__ == '__main__':
    unittest.main()
