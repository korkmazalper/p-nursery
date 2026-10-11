import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";

export default function Recipe({ categories, foods }) {
  const navigation = useNavigation();

  const renderItem = ({ item, index }) => (
    <ArticleCard item={item} index={index} navigation={navigation} />
  );

  return (
    <View style={styles.container}>
      <View testID="recipesDisplay">
        <FlatList
          data={foods}
          numColumns={2}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.idFood || index.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const ArticleCard = ({ item, index, navigation }) => {
  return (
    <TouchableOpacity
      style={[styles.cardContainer, { paddingLeft: 10, paddingRight: 10 }]}
      testID="articleDisplay"
      onPress={() => navigation.navigate("RecipeDetail", item)}
    >
      {item?.recipeImage && (
        <Image source={{ uri: item.recipeImage }} style={styles.articleImage} />
      )}
      <Text style={styles.articleText} numberOfLines={1}>
        {item?.recipeName || "Recipe"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: wp(4),
    marginTop: hp(2),
  },
  cardContainer: {
    justifyContent: "center",
    marginBottom: hp(1.5),
    flex: 1,
  },
  articleImage: {
    width: "100%",
    height: hp(20),
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  articleText: {
    fontSize: hp(1.6),
    fontWeight: "600",
    color: "#52525B",
    marginTop: hp(0.5),
  },
});
