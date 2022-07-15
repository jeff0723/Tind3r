import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'
import Header from '../components/UI/Header'
import Swiper from 'react-native-deck-swiper'
import { AntDesign, Ionicons, Entypo } from '@expo/vector-icons'
import { color } from '../constant/color'

type Props = {}
const user_list = [
    {
        id: 1,
        name: "Dolly",
        age: 22,
        bio: "被盜圖後決定自己來玩",
        url: "https://images-ssl.gotinder.com/u/8hEbHEV7sfBYoYSLnrNKLh/g1C5NDxwE9ryyE8zMuFJWc.webp?Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6IiovdS84aEViSEVWN3NmQllvWVNMbnJOS0xoLyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE2NTgxMDIxNDB9fX1dfQ__&Signature=yfyTi47LK47Q1ZLR97p4WYr65xkNIQCACwXCRZ2ctoplNdiXOoeTkfTQxh4GZjlVWgSCut1y-o-WwLJC3rCV9pf9HkPgvMu-vmAaHuQPoUYFhnCYPuotC1FQzC-ZQlSyJqkH7L0ltwGEx9DDxuOGO3qA8lZlwKy3NLaYfVK93GXXN8~TMby3OdYv7fzKqgOh2vTPMKxeJUclqCFocbUeZWSha1NUHBa0EyHShus-d9TW1CiCai6pkgASm5Z7fTBKkWJxP0epvyUl1hQtNSNhsWMN5tpLWRSt2UCVwi-lBKkmxlleHVTKYAPBGqUamcGaSi63KEWUra2sf0uUqUqviw__&Key-Pair-Id=K368TLDEUPA6OI"
    },
    {
        id: 2,
        name: "Angel",
        age: 21,
        bio: "衝浪 自潛 跳舞 拍底片 曬太陽 盧廣仲 可以不催我回訊息的再滑 謝謝！",
        url: "https://images-ssl.gotinder.com/u/p9ij6RC5TDXpNdcaLyoNZN/6fB2rPhDBu8WkvChUfJutT.webp?Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6IiovdS9wOWlqNlJDNVREWHBOZGNhTHlvTlpOLyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE2NTgwNzY2Nzh9fX1dfQ__&Signature=jUB0kihSJkP4Ueyp4DCq5tPg5M6Bw3hqbwxpyyj77S19AR8MtYRZnaI4KqA2ddu5otBoBsN9zq27Ph3-QfEFUCrSCjMMZaJTfC5cvPsog1HfI9xzd7iAarFEnkctp1ocuI93HHs7B5AvNiqRMQ1dGGt617HAT-gyZMN6xXSjE83QpY~d5BClXwbs15mAU9mJb~dGrfCcJYr9IQQzSlXAOHGRqP8evUHyU0KexIBxt0589oiG4~kT61S~7Vx0Q7le2Agh1PIu-LGBi2zMAbznptc-arA4f2pI2OjLe56ZVsbD-bnbkwh-4tkXByBYl0Q2wuQMTr2IO2T0HbUGeRLC0Q__&Key-Pair-Id=K368TLDEUPA6OI"
    },
    {
        id: 3,
        name: "Rebaecca",
        age: 24,
        bio: "157.\n養狗狗兼任鏟屎官",
        url: "https://images-ssl.gotinder.com/u/wRCMJrys9GicD4fXpkrHcL/5aLDo1fmzzoExtt7PCwjmJ.webp?Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6IiovdS93UkNNSnJ5czlHaWNENGZYcGtySGNMLyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE2NTgxMjE5NDN9fX1dfQ__&Signature=VVej39nQcqGa9aYQ5UBr8LMwkIJc-s8R~vX8v6Opttwijq87XsSfjAwc4O~xLKmRA3nr5X7FEAgF8eiw9~-9~IfEct0J1iMlN87ZuYJp5b3vCbMMx6NpPlrPNJmA-dkn05x9Hywl~FyxbAw57niksDUzlFLfgEV6MuGLzJjPwcxUkXQA~87WIH34f1~v7ZoSY-Zs1jrjuQonieOgEiRuE2L-3L9p8Uzw2YuxCgBjRVi4PkifdNKn2F3vTmBGwPxK~XhYp6DKj~-AQmaupYTcAZCXR0b7TCEz94zYQQvqsg1MM6JyM0-~K0rio-79njfWPOIYxfHjNDW3gwzjwUXZlg__&Key-Pair-Id=K368TLDEUPA6OI"
    },
    {
        id: 4,
        name: "Amelia",
        age: 21,
        bio: "衝浪 自潛 跳舞 拍底片 曬太陽 盧廣仲 可以不催我回訊息的再滑 謝謝！",
        url: "https://images-ssl.gotinder.com/u/ndxSAvoicWLMMiXJF7553u/5Dv9X5kMUN474nC7SdyYAN.jpeg?Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6IiovdS9uZHhTQXZvaWNXTE1NaVhKRjc1NTN1LyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE2NTgwNzQ5MDh9fX1dfQ__&Signature=qCUzaJVljqzARInI2rpGtcbim2-DarpsSpe9A~vpd86NmaKal5An2typJU9SkRVqUs2Ulkb91ca~byMplhDDugfMvcU0Qqe11CGicI2eLs~JbNuVC8KTL84qXFDb9~L-fMKhdFgvRt2jz-5XSVM4QeYdoch-Tku7eVYDs427Ae~H0caSUHcPrT6-DOO1bwvpOquw~LuC~ftcwv8J4Nll~kxyHnFY-vqF23GZrivWdjXbLb6lAE88xFBo0iwg4Sz9YV-ufkl4jWGM4S~uAt46bm9zHxu0~ajXR~ojb2f0Fzv7579ocY2fAPUyPUAYHOFtL2fSWd2H1EeB49IclMViiQ__&Key-Pair-Id=K368TLDEUPA6OI"
    }
]
const SwipeScreen = (props: Props) => {
    return (
        <View style={styles.body}>
            <Header />
            {/* Card */}
            <View style={styles.swiperContainer}>
                <Swiper
                    cards={user_list}
                    stackSize={5}
                    cardIndex={0}
                    renderCard={(card) => (
                        //need to refactor to a swiper card component
                        <View key={card.id} style={styles.card}>
                            <ImageBackground style={styles.cardImage} imageStyle={{ borderRadius: 24 }} source={{ uri: card.url }}>
                                <View style={styles.imageLayout1}>
                                </View>
                                <View style={[styles.imageLayout2, styles.cardMask]}>
                                    <View style={styles.contentBox1}>
                                        <Text style={{ color: color.white, fontSize: 28 }}>{card.name} <Text style={{ fontSize: 24 }}>{card.age}</Text></Text>
                                        <View style={styles.infoBox}>
                                            <Text style={{ color: color.white, fontSize: 18, width: 250 }}>{card.bio}</Text>
                                            <Ionicons name='information-circle' size={36} color={color.white} />
                                        </View>

                                    </View>
                                    <View style={styles.contentBox2}>
                                        <View style={styles.iconBox}>
                                            <TouchableOpacity style={styles.dislike}>
                                                <Entypo name="cross" size={36} color={color.dislike} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.star}>
                                                <AntDesign name="star" size={24} color={color.star} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.like}>
                                                <AntDesign name="heart" size={24} color={color.like} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </ImageBackground>
                        </View>
                    )}
                />
            </View>

        </View>
    )
}

export default SwipeScreen

const styles = StyleSheet.create({
    body: {
        backgroundColor: '#fff',
        flex: 1
    },
    card: {
        height: 615,
        borderRadius: 24,
    },
    swiperContainer: {
        marginTop: 32
    },
    cardImage: {
        flex: 1,
        height: '100%',
        width: '100%',
        borderRadius: 24,
    },
    cardMask: {
        width: '100%',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%)',
    },
    contentBox1: {
        paddingHorizontal: 24,
    },
    contentBox2: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconBox: {
        width: 200,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    imageLayout1: {
        flex: 0.7
    },
    imageLayout2: {
        flex: 0.3,
        justifyContent: 'flex-end',
        paddingBottom: 16
    },
    infoBox: {
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
    },
    dislike: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: color.dislike,
        justifyContent: 'center',
        alignItems: 'center',

    },
    star: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        borderWidth: 2,
        borderColor: color.star,
        justifyContent: 'center',
        alignItems: 'center',
    },
    like: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: color.like,
        justifyContent: 'center',
        alignItems: 'center',
    }
})