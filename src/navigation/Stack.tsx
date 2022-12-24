import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {
  Login,
  Certification,
  Agreement,
  SeeAgreement,
  Accession,
  Writing,
  Read,
  SeeImage,
  Map,
  Setting,
  Notification,
  Chatting,
} from '../screens';
import BottomTab from './BottomTab';

const Stack = createStackNavigator();

interface StackProps {
  is_login: boolean;
}

export const ScreenNames = {
  Login: 'Login',
  Certification: 'Certification',
  Agreement: 'Agreement',
  SeeAgreement: 'SeeAgreement',
  Accession: 'Accession',
  Home: 'Home',
  Writing: 'Writing',
  Read: 'Read',
  SeeImage: 'SeeImage',
  Map: 'Map',
  Setting: 'Setting',
  Notification: 'Notification',
  Chatting: 'Chatting',
};

export default function ({is_login}: StackProps) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={is_login ? ScreenNames.Home : ScreenNames.Login}
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        <Stack.Screen name={ScreenNames.Login} component={Login} />
        <Stack.Screen
          name={ScreenNames.Certification}
          component={Certification}
        />
        <Stack.Screen name={ScreenNames.Agreement} component={Agreement} />
        <Stack.Screen
          name={ScreenNames.SeeAgreement}
          component={SeeAgreement}
        />
        <Stack.Screen name={ScreenNames.Accession} component={Accession} />
        <Stack.Screen name={ScreenNames.Home} component={BottomTab} />
        <Stack.Screen name={ScreenNames.Writing} component={Writing} />
        <Stack.Screen name={ScreenNames.Read} component={Read} />
        <Stack.Screen name={ScreenNames.SeeImage} component={SeeImage} />
        <Stack.Screen name={ScreenNames.Map} component={Map} />
        <Stack.Screen name={ScreenNames.Setting} component={Setting} />
        <Stack.Screen
          name={ScreenNames.Notification}
          component={Notification}
        />
        <Stack.Screen name={ScreenNames.Chatting} component={Chatting} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
