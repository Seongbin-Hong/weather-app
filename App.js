import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "4cd2d4c47716385c03ca6365067676f3";

export default function App() {
    const [location, setLocation] = useState();
    const [city, setCity] = useState("Loading...");
    const [okay, setOkay] = useState(true);
    const [days, setDays] = useState([]);

    const getLocation = async () => {
        const { granted } = await Location.requestForegroundPermissionsAsync();
        if (!granted) {
            setOkay(false);
        }
        const {
            coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync({
            accuracy: 5,
        });
        const location = await Location.reverseGeocodeAsync(
            { latitude, longitude },
            { useGoogleMaps: false }
        );
        setLocation(location);
        setCity(location[0].city);
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alert&appid=${API_KEY}&units=metric`
        );
        const json = await response.json();

        setDays(json.daily);
    };

    useEffect(() => {
        getLocation();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.city}>
                <Text style={styles.cityName}>{city}</Text>
            </View>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.weather}
            >
                {days.length === 0 ? (
                    <View style={styles.day}>
                        <ActivityIndicator
                            size="large"
                            color="teal"
                            style={{ marginTop: 10 }}
                        />
                    </View>
                ) : (
                    days.map((day, index) => (
                        <View key={index} style={styles.day}>
                            <Text style={styles.temp}>
                                {parseFloat(day.temp.day).toFixed(1)}
                            </Text>
                            <Text style={styles.description}>
                                {day.weather[0].main}
                            </Text>
                            <Text style={styles.tinyText}>
                                {day.weather[0].description}
                            </Text>
                        </View>
                    ))
                )}
            </ScrollView>
            <StatusBar style="dark" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fecf05",
    },
    city: {
        flex: 1.5,
        alignItems: "center",
        justifyContent: "center",
    },
    cityName: {
        fontSize: 60,
        fontWeight: "500",
    },
    weather: {},
    day: {
        width: SCREEN_WIDTH,
        alignItems: "center",
    },
    temp: {
        fontSize: 178,
    },
    description: {
        marginTop: -30,
        fontSize: 60,
    },
    tinyText: {
        fontSize: 20,
    },
});
