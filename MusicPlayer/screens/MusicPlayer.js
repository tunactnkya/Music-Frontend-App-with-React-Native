import React, { useEffect, useState, useRef } from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Image, FlatList, Animated } from 'react-native'
import TrackPlayer, { Capability, Event, RepeatMode, State, usePlaybackState, useProgress, useTrackPlayerEvents } from 'react-native-track-player';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Slider from '@react-native-community/slider';
import songs from '../model/Data';

const { width, height } = Dimensions.get('window');

const setUpPlayer = async () => {
    try {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.add(songs);
    } catch (e) {
        console.log(e)
    }
};

const togglePayBack = async playBackState => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack != null) {
        if (playBackState == State.Paused) {
            await TrackPlayer.play();
        } else {
            await TrackPlayer.pause();
        }
    }
}


const MusicPlayer = () => {
    const playBackState = usePlaybackState()
    const [songIndex, setSongIndex] = useState(0)
    const progress = useProgress();

    const scrollX = useRef(new Animated.Value(0)).current;
    const songSlider = useRef(null);

    useEffect(() => {

        scrollX.addListener(({ value }) => {

            const index = Math.round(value / width);
            setSongIndex(index);
        });
    }, [])

    const skipToNext = () => {
        songSlider.current.scrollToOffset({
            offsett: (songIndex + 1) * width,
        })
    }

    const skipToPrevious = () => {
        songSlider.current.scrollToOffset({
            offsett: (songIndex - 1) * width,
        })
    }

    const renderSongs = ({ item, index }) => {
        return (
            <Animated.View style={styles.mainImageWrapper} >
                <View style={[styles.imageWrapper, styles.elevation]} >
                    <Image
                        source={item.artwork}
                        style={styles.musicImage} />
                </View>
            </Animated.View>
        )
    }
    return (
        <SafeAreaView style={styles.container} >
            <View style={styles.mainContainer} >

                <Animated.FlatList
                    ref={songSlider}
                    renderItem={renderSongs}
                    data={songs}
                    keyExtractor={item => item.id}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {
                                    contentOffset: { x: scrollX },
                                }
                            }
                        ],
                        { useNativeDriver: true }
                    )}
                />
                <View>
                    <Text style={[styles.songTitle, styles.songContent]} >{songs[songIndex].title} </Text>
                    <Text style={[styles.songArtist, styles.songContent]} >{songs[songIndex].artist}</Text>
                </View>
                <View>
                    <Slider
                        style={styles.progressBar}
                        value={progress.position}
                        minimumValue={0}
                        maximumValue={progress.duration}
                        thumbTintColor="#FFD369"
                        minimumTrackTintColor='#FFD369'
                        maximumTrackTintColor='#fff'
                        onSlidingComplete={async value => {
                            await TrackPlayer.seekTo(value)
                        }}
                    /> 
                    <View style={styles.progressLevelDuration} >
                        <Text style={styles.progressLabelText}>{
                            new Date(progress.position * 1000).toLocaleTimeString().substring(3)
                        } </Text>
                        <Text style={styles.progressLabelText}>
                            {new Date((progress.duration - progress.position) * 1000).toLocaleTimeString().substring(3)
                            } </Text>
                    </View>
                </View>

                <View style={styles.musicControlsContainer} >
                    <TouchableOpacity onPress={skipToPrevious} >
                        <Ionicons name='play-skip-back-outline' size={35} color="#FFD369" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => togglePayBack(playBackState)} >
                        <Ionicons
                            name={
                                playBackState === State.Playing
                                    ? 'ios-pause-circle'
                                    : 'ios-play-circle'
                            }
                            size={75}
                            color="#FFD369"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={skipToNext} >
                        <Ionicons name='play-skip-forward-outline' size={35} color="#FFD369" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.bottomContainer} >
                <View style={styles.bottomIconWrapper} >
                    <TouchableOpacity onPress={() => { }} >
                        <Ionicons name='heart-outline' size={30} color="#888888" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { }} >
                        <Ionicons name='repeat' size={30} color="#888888" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { }} >
                        <Ionicons name='share-outline' size={30} color="#888888" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { }} >
                        <Ionicons name='ellipsis-horizontal' size={30} color="#888888" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}
export default MusicPlayer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#062462',
    },
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomContainer: {
        width: width,
        alignItems: 'center',
        paddingVertical: 15,
        borderTopColor: '#393E46',
        borderWidth: 1
    },
    bottomIconWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    imageWrapper: {
        width: 300,
        height: 340,
        marginBottom: 20,
        marginTop: 20
    },
    musicImage: {
        width: '100%',
        height: '100%',
        borderRadius: 15
    },

    elevation: {
        elevation: 5,
        shadowColor: '#ccc',
        shadowOffset: {
            width: 5,
            height: 5
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84
    },
    songContent: {
        textAlign: 'center',
        color: '#EEEEEE'
    },
    songTitle: {
        fontSize: 18,
        fontWeight: '600',

    },
    songArtist: {
        fontSize: 18,
        fontWeight: '300',
    },
    progressBar: {
        width: 350,
        height: 40,
        marginTop: 20,
        flexDirection: 'row'
    },
    progressLevelDuration: {
        width: 340,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    progressLabelText: {
        color: '#fff',
        fontWeight: '500'
    },
    musicControlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '60%',
        marginTop: 10
    },
    mainImageWrapper: {
        width: width,
        justifyContent: 'center',
        alignItems: 'center'
    }
})