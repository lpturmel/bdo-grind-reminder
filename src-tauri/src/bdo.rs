use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};

lazy_static! {
    pub static ref GRIND_SPOTS: Vec<GrindSpot> = {
        let grind_spots = include_str!("../grind_spots.json");
        serde_json::from_str(grind_spots).unwrap()
    };
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GrindSpot {
    pub name: String,
    pub is_agris: bool,
    pub monster_tags: Vec<String>,
}
