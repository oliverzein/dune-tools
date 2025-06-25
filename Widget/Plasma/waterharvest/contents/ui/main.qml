import QtQuick
import QtQuick.Layouts
import org.kde.plasma.plasmoid
import org.kde.plasma.components as PlasmaComponents
import org.kde.kirigami as Kirigami
import org.kde.notification 1.0

PlasmoidItem {
    id: root
    
    Layout.preferredWidth: Kirigami.Units.gridUnit * 4

    property int secondsLeft: 0
    property list<int> refMinutes: []
    property string refTime: plasmoid.configuration.refTime;
    onRefTimeChanged: refFromTimestring(refTime);

    //fullRepresentation: HarvestView { }

    function refFromTimestring(timestring){
        var minutesFromTimestring = parseInt(timestring.split(":")[1]);
        if(minutesFromTimestring < 30){
            root.refMinutes[0] = minutesFromTimestring;
            root.refMinutes[1] = minutesFromTimestring + 30;
        } else {
            root.refMinutes[0] = minutesFromTimestring - 30;
            root.refMinutes[1] = minutesFromTimestring;
        }
    }

    Component.onCompleted: {
        console.log(root.refTime);
        refFromTimestring(root.refTime);

        console.log(root.refMinutes[0]);
        console.log(root.refMinutes[1]);
    }

    Notification {
        id: notification
        componentName: "plasma_workspace"
        eventId: "notification"
        title: "Water Harvest"
        text: "It's optimal harvest time!"
        autoDelete: true
    }

    Timer {
        id: timer
        interval: 1000
        running: true
        repeat: true
        onTriggered: {            
            var now = new Date();
            var next = new Date(now);
            var min = now.getMinutes();
            if (min < root.refMinutes[0]) {
                next.setMinutes(root.refMinutes[0], 0, 0);
            } else if (min < root.refMinutes[1]) {
                next.setMinutes(root.refMinutes[1], 0, 0);
            } else {
                next.setHours(now.getHours() + 1, root.refMinutes[0], 0, 0);
            }
            root.secondsLeft = Math.floor((next - now) / 1000);
                        
            if (root.secondsLeft == 2 * 60) {
                notification.text = "Optimal harvest time in 2 minutes!";
                notification.sendEvent("notification");
            }
        }

    }

    PlasmaComponents.Label {
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        id: textLabel
        text: Math.floor(root.secondsLeft/60) + ":" + (root.secondsLeft%60).toString().padStart(2, '0')
        //text: root.secondsLeft.toString()
        font.pixelSize: 12
        horizontalAlignment: Text.AlignHCenter
    }

    PlasmaComponents.ProgressBar {
        anchors.top: textLabel.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        value: root.secondsLeft
        to: 30 * 60 // 30 minutes in seconds
    }
}
