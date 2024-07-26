// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use self::bdo::{GrindSpot, GRIND_SPOTS};

pub mod bdo;

#[tauri::command]
fn load_grind_spots() -> Vec<GrindSpot> {
    GRIND_SPOTS.clone()
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![load_grind_spots])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
