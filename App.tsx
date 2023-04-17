import { useEffect } from 'react';
import { Text, View, Button } from 'react-native';
import { styles } from './styles';
import notifee, { AndroidImportance, EventType, TimestampTrigger, TriggerType } from '@notifee/react-native'

//https://notifee.app/
//para executar é preciso dar o comando npx expo prebuild --clean
//https://docs.expo.dev/versions/latest/sdk/build-properties/

export default function App() {

  async function notification() {
    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: 'teste',
      name: 'sales',
      vibration: true,
      importance: AndroidImportance.HIGH
    })

    await notifee.displayNotification({
      id: '7',
      title: 'Olá <strong>Arley</strong>',
      body: 'Notificação de <span style="color:red">teste</span>',
      android: { channelId }
    })
  }

  useEffect(() => { //tratamento em primeiro plano
    return notifee.onForegroundEvent(({ type, detail }) => {

      switch (type) {
        case EventType.DISMISSED:
          console.log('usuario descartou a notificação')
          break;
        case EventType.ACTION_PRESS:
          console.log('Usuário tocou na notificação', detail.notification)

      }
    })
  }, [])

  useEffect(() => {//tratamento em segundo plano
    return notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('Usuario tocou na notificação', detail.notification)
      }
    })
  }, [])

  //Atualizar uma notificação
  async function updateNotification(){
    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: 'teste',
      name: 'sales',
      vibration: true,
      importance: AndroidImportance.HIGH
    })

    await notifee.displayNotification({
      id: '7',
      title: 'Olá <strong>Arley</strong>',
      body: 'Notificação de <span style="color:red">teste</span>',
      android: { channelId }
    })
  }

  //cancelar notificação
  async function cancelNotification(){
    await notifee.cancelNotification('7')
  }

  //agendar notificação
  async function scheduleNotification(){
    const date = new Date(Date.now())
    date.setMinutes(date.getMinutes() + 1)

    const trigger:TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime()
    } 

    await notifee.createTriggerNotification({
      title:'Notificação agendada',
      body:'Essa é uma notificação agendada',
      android:{
        channelId: 'sales',
        importance: AndroidImportance.HIGH
      }
    }, trigger)
  }

  return (
    <View style={styles.container}>
      <Text>Local Notification</Text>
      <Button title='Enviar notificação' onPress={notification} />
      <Button title='Atualizar' onPress={updateNotification} />
      <Button title='Cancelar notificação' onPress={cancelNotification} />
      <Button title='Agendar notificação' onPress={scheduleNotification} />
    </View>
  );
}


