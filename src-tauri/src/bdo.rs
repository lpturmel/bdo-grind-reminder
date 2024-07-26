use serde::{Deserialize, Serialize};
use std::sync::LazyLock;

pub static GRIND_SPOTS: LazyLock<Vec<GrindSpot>> = LazyLock::new(|| {
    let grind_spots = include_str!("../grind_spots.json");
    let mut grind_spots: Vec<GrindSpot> = serde_json::from_str(grind_spots).unwrap();
    // sort by name
    grind_spots.sort_by(|a, b| a.name.cmp(&b.name));
    grind_spots
});

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GrindSpot {
    pub name: String,
    pub is_agris: bool,
    pub zone: String,
    pub monster_tags: Vec<String>,
}
