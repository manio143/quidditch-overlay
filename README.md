# Quidditch Stream Overlay

If you're streaming a quidditch match you might want to overlay team names, score and game time on top of your footage. So I made a fairly simple program for that.

To run: clone the repo, run `npm install` then `npm start`.

You get a GUI app for setup and overlay control that publishes overlay to <http://localhost:8080/>

You can then run OBS with Browser overlay (there's a plugin needed under Linux) to combine the overlay with your footage.
