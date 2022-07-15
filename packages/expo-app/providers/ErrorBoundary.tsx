import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { ErrorInfo } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {
  errorMessage: string,

}

const Fallback = (props: Props) => {
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text>Your error: {props.errorMessage}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export class ErrorBoundary extends React.Component<any, any> {
  state = {
    error: false
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  resetError = () => {
    this.setState({ error: null });
  };

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // deal with errorInfo if needed
  }

  getErrorMessage = () =>
    `View: ${this.props.view}\n${this.state.error.toString()}`;

  render() {
    return <Fallback errorMessage={this.getErrorMessage()} />
  }
}

export default ErrorBoundary;


const styles = StyleSheet.create({})